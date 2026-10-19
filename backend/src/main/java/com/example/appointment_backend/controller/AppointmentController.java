package com.example.appointment_backend.controller;

import com.example.appointment_backend.dto.AppointmentRequest;
import com.example.appointment_backend.dto.AppointmentResponseDto;
import com.example.appointment_backend.dto.AppointmentStatusRequest;
import com.example.appointment_backend.model.*;
import com.example.appointment_backend.repository.AppointmentRepository;
import com.example.appointment_backend.repository.DoctorProfileRepository;
import com.example.appointment_backend.repository.PrescriptionRepository;
import com.example.appointment_backend.repository.UserRepository;
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
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final PrescriptionRepository prescriptionRepository;

    public AppointmentController(AppointmentRepository appointmentRepository,
                                 UserRepository userRepository,
                                 DoctorProfileRepository doctorProfileRepository,
                                 PrescriptionRepository prescriptionRepository) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.doctorProfileRepository = doctorProfileRepository;
        this.prescriptionRepository = prescriptionRepository;
    }

    private AppointmentResponseDto toDto(Appointment apt) {
        DoctorProfile profile = doctorProfileRepository.findByUserId(apt.getDoctor().getId()).orElse(null);
        String specialization = profile != null ? profile.getSpecialization() : "General Physician";
        Double fee = profile != null ? profile.getConsultationFee() : 50.0;
        String address = profile != null ? profile.getClinicAddress() : "";
        Long prescriptionId = prescriptionRepository.findByAppointmentId(apt.getId())
                .map(Prescription::getId)
                .orElse(null);

        return new AppointmentResponseDto(apt, specialization, fee, address, prescriptionId);
    }

    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<?> bookAppointment(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody AppointmentRequest request) {

        User patient = userRepository.findById(userDetails.getId()).orElse(null);
        if (patient == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Patient not found"));
        }

        User doctor = userRepository.findById(request.getDoctorId()).orElse(null);
        if (doctor == null || doctor.getRole() != Role.DOCTOR) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid doctor selected"));
        }

        Appointment appointment = new Appointment(
                patient,
                doctor,
                request.getAppointmentDate(),
                request.getAppointmentTime(),
                request.getReason()
        );

        Appointment saved = appointmentRepository.save(appointment);
        return ResponseEntity.ok(toDto(saved));
    }

    @GetMapping("/my")
    public ResponseEntity<List<AppointmentResponseDto>> getMyAppointments(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        User user = userRepository.findById(userDetails.getId()).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        List<Appointment> list;
        if (user.getRole() == Role.DOCTOR) {
            list = appointmentRepository.findByDoctorOrderByAppointmentDateDesc(user);
        } else {
            list = appointmentRepository.findByPatientOrderByAppointmentDateDesc(user);
        }

        List<AppointmentResponseDto> dtos = list.stream().map(this::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAppointmentById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        Appointment apt = appointmentRepository.findById(id).orElse(null);
        if (apt == null) {
            return ResponseEntity.notFound().build();
        }

        // Only patient or doctor of this appointment can view it
        if (!apt.getPatient().getId().equals(userDetails.getId()) &&
                !apt.getDoctor().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }

        return ResponseEntity.ok(toDto(apt));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateAppointmentStatus(
            @PathVariable Long id,
            @Valid @RequestBody AppointmentStatusRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        Appointment apt = appointmentRepository.findById(id).orElse(null);
        if (apt == null) {
            return ResponseEntity.notFound().build();
        }

        boolean isDoctor = apt.getDoctor().getId().equals(userDetails.getId());
        boolean isPatient = apt.getPatient().getId().equals(userDetails.getId());

        if (!isDoctor && !isPatient) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }

        // Patient can only cancel
        if (isPatient && !isDoctor) {
            if (request.getStatus() != AppointmentStatus.CANCELLED) {
                return ResponseEntity.badRequest().body(Map.of("message", "Patients can only cancel appointments"));
            }
        }

        apt.setStatus(request.getStatus());
        if (request.getCancellationReason() != null) {
            apt.setCancellationReason(request.getCancellationReason());
        }

        Appointment updated = appointmentRepository.save(apt);
        return ResponseEntity.ok(toDto(updated));
    }
}
