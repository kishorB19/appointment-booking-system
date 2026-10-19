package com.example.appointment_backend.controller;

import com.example.appointment_backend.dto.PrescriptionRequest;
import com.example.appointment_backend.dto.PrescriptionResponseDto;
import com.example.appointment_backend.model.*;
import com.example.appointment_backend.repository.AppointmentRepository;
import com.example.appointment_backend.repository.DoctorProfileRepository;
import com.example.appointment_backend.repository.PrescriptionRepository;
import com.example.appointment_backend.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    private final PrescriptionRepository prescriptionRepository;
    private final AppointmentRepository appointmentRepository;
    private final DoctorProfileRepository doctorProfileRepository;

    public PrescriptionController(PrescriptionRepository prescriptionRepository,
                                  AppointmentRepository appointmentRepository,
                                  DoctorProfileRepository doctorProfileRepository) {
        this.prescriptionRepository = prescriptionRepository;
        this.appointmentRepository = appointmentRepository;
        this.doctorProfileRepository = doctorProfileRepository;
    }

    private PrescriptionResponseDto toDto(Prescription p) {
        DoctorProfile profile = doctorProfileRepository.findByUserId(p.getAppointment().getDoctor().getId()).orElse(null);
        String specialization = profile != null ? profile.getSpecialization() : "General Physician";
        String clinicAddress = profile != null ? profile.getClinicAddress() : "";
        return new PrescriptionResponseDto(p, specialization, clinicAddress);
    }

    @PostMapping("/appointment/{appointmentId}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> createOrUpdatePrescription(
            @PathVariable Long appointmentId,
            @Valid @RequestBody PrescriptionRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        Appointment appointment = appointmentRepository.findById(appointmentId).orElse(null);
        if (appointment == null) {
            return ResponseEntity.notFound().build();
        }

        if (!appointment.getDoctor().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(403).body(Map.of("message", "Only the assigned doctor can write this prescription"));
        }

        Prescription prescription = prescriptionRepository.findByAppointment(appointment)
                .orElseGet(() -> new Prescription(appointment, request.getDiagnosis(), request.getMedicines(), request.getInstructions(), request.getNotes()));

        prescription.setDiagnosis(request.getDiagnosis());
        prescription.setMedicines(request.getMedicines());
        prescription.setInstructions(request.getInstructions());
        prescription.setNotes(request.getNotes());

        // Automatically set appointment status to COMPLETED if not already
        if (appointment.getStatus() != AppointmentStatus.COMPLETED) {
            appointment.setStatus(AppointmentStatus.COMPLETED);
            appointmentRepository.save(appointment);
        }

        Prescription saved = prescriptionRepository.save(prescription);
        return ResponseEntity.ok(toDto(saved));
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<?> getPrescriptionByAppointment(
            @PathVariable Long appointmentId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        Appointment appointment = appointmentRepository.findById(appointmentId).orElse(null);
        if (appointment == null) {
            return ResponseEntity.notFound().build();
        }

        if (!appointment.getPatient().getId().equals(userDetails.getId()) &&
                !appointment.getDoctor().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }

        return prescriptionRepository.findByAppointment(appointment)
                .map(p -> ResponseEntity.ok(toDto(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPrescriptionById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        Prescription prescription = prescriptionRepository.findById(id).orElse(null);
        if (prescription == null) {
            return ResponseEntity.notFound().build();
        }

        Appointment appointment = prescription.getAppointment();
        if (!appointment.getPatient().getId().equals(userDetails.getId()) &&
                !appointment.getDoctor().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }

        return ResponseEntity.ok(toDto(prescription));
    }

    @GetMapping("/my")
    public ResponseEntity<List<PrescriptionResponseDto>> getMyPrescriptions(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        List<Prescription> list;
        if (userDetails.getRole() == Role.DOCTOR) {
            list = prescriptionRepository.findByDoctorId(userDetails.getId());
        } else {
            list = prescriptionRepository.findByPatientId(userDetails.getId());
        }

        List<PrescriptionResponseDto> dtos = list.stream().map(this::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
