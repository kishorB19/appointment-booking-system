package com.example.appointment_backend.dto;

import com.example.appointment_backend.model.Prescription;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class PrescriptionResponseDto {
    private Long id;
    private Long appointmentId;
    private LocalDate appointmentDate;
    private String appointmentTime;

    private Long doctorId;
    private String doctorName;
    private String doctorSpecialization;
    private String clinicAddress;

    private Long patientId;
    private String patientName;
    private String patientEmail;
    private String patientPhone;

    private String diagnosis;
    private String medicines;
    private String instructions;
    private String notes;
    private LocalDateTime createdAt;

    public PrescriptionResponseDto() {}

    public PrescriptionResponseDto(Prescription p, String doctorSpecialization, String clinicAddress) {
        this.id = p.getId();
        if (p.getAppointment() != null) {
            this.appointmentId = p.getAppointment().getId();
            this.appointmentDate = p.getAppointment().getAppointmentDate();
            this.appointmentTime = p.getAppointment().getAppointmentTime();

            if (p.getAppointment().getDoctor() != null) {
                this.doctorId = p.getAppointment().getDoctor().getId();
                this.doctorName = p.getAppointment().getDoctor().getFullName();
            }
            if (p.getAppointment().getPatient() != null) {
                this.patientId = p.getAppointment().getPatient().getId();
                this.patientName = p.getAppointment().getPatient().getFullName();
                this.patientEmail = p.getAppointment().getPatient().getEmail();
                this.patientPhone = p.getAppointment().getPatient().getPhone();
            }
        }
        this.doctorSpecialization = doctorSpecialization;
        this.clinicAddress = clinicAddress;
        this.diagnosis = p.getDiagnosis();
        this.medicines = p.getMedicines();
        this.instructions = p.getInstructions();
        this.notes = p.getNotes();
        this.createdAt = p.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
    }

    public LocalDate getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDate appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public String getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(String appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getDoctorSpecialization() {
        return doctorSpecialization;
    }

    public void setDoctorSpecialization(String doctorSpecialization) {
        this.doctorSpecialization = doctorSpecialization;
    }

    public String getClinicAddress() {
        return clinicAddress;
    }

    public void setClinicAddress(String clinicAddress) {
        this.clinicAddress = clinicAddress;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getPatientEmail() {
        return patientEmail;
    }

    public void setPatientEmail(String patientEmail) {
        this.patientEmail = patientEmail;
    }

    public String getPatientPhone() {
        return patientPhone;
    }

    public void setPatientPhone(String patientPhone) {
        this.patientPhone = patientPhone;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public String getMedicines() {
        return medicines;
    }

    public void setMedicines(String medicines) {
        this.medicines = medicines;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
