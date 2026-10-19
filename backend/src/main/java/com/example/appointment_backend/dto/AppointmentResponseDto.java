package com.example.appointment_backend.dto;

import com.example.appointment_backend.model.Appointment;
import com.example.appointment_backend.model.AppointmentStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class AppointmentResponseDto {
    private Long id;
    private Long patientId;
    private String patientName;
    private String patientEmail;
    private String patientPhone;

    private Long doctorId;
    private String doctorName;
    private String doctorEmail;
    private String doctorPhone;
    private String doctorSpecialization;
    private Double consultationFee;
    private String clinicAddress;

    private LocalDate appointmentDate;
    private String appointmentTime;
    private AppointmentStatus status;
    private String reason;
    private String cancellationReason;
    private LocalDateTime createdAt;
    private boolean hasPrescription;
    private Long prescriptionId;

    public AppointmentResponseDto() {}

    public AppointmentResponseDto(Appointment apt, String specialization, Double consultationFee, String clinicAddress, Long prescriptionId) {
        this.id = apt.getId();
        if (apt.getPatient() != null) {
            this.patientId = apt.getPatient().getId();
            this.patientName = apt.getPatient().getFullName();
            this.patientEmail = apt.getPatient().getEmail();
            this.patientPhone = apt.getPatient().getPhone();
        }
        if (apt.getDoctor() != null) {
            this.doctorId = apt.getDoctor().getId();
            this.doctorName = apt.getDoctor().getFullName();
            this.doctorEmail = apt.getDoctor().getEmail();
            this.doctorPhone = apt.getDoctor().getPhone();
        }
        this.doctorSpecialization = specialization;
        this.consultationFee = consultationFee;
        this.clinicAddress = clinicAddress;

        this.appointmentDate = apt.getAppointmentDate();
        this.appointmentTime = apt.getAppointmentTime();
        this.status = apt.getStatus();
        this.reason = apt.getReason();
        this.cancellationReason = apt.getCancellationReason();
        this.createdAt = apt.getCreatedAt();

        this.prescriptionId = prescriptionId;
        this.hasPrescription = prescriptionId != null;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getDoctorEmail() {
        return doctorEmail;
    }

    public void setDoctorEmail(String doctorEmail) {
        this.doctorEmail = doctorEmail;
    }

    public String getDoctorPhone() {
        return doctorPhone;
    }

    public void setDoctorPhone(String doctorPhone) {
        this.doctorPhone = doctorPhone;
    }

    public String getDoctorSpecialization() {
        return doctorSpecialization;
    }

    public void setDoctorSpecialization(String doctorSpecialization) {
        this.doctorSpecialization = doctorSpecialization;
    }

    public Double getConsultationFee() {
        return consultationFee;
    }

    public void setConsultationFee(Double consultationFee) {
        this.consultationFee = consultationFee;
    }

    public String getClinicAddress() {
        return clinicAddress;
    }

    public void setClinicAddress(String clinicAddress) {
        this.clinicAddress = clinicAddress;
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

    public AppointmentStatus getStatus() {
        return status;
    }

    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getCancellationReason() {
        return cancellationReason;
    }

    public void setCancellationReason(String cancellationReason) {
        this.cancellationReason = cancellationReason;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isHasPrescription() {
        return hasPrescription;
    }

    public void setHasPrescription(boolean hasPrescription) {
        this.hasPrescription = hasPrescription;
    }

    public Long getPrescriptionId() {
        return prescriptionId;
    }

    public void setPrescriptionId(Long prescriptionId) {
        this.prescriptionId = prescriptionId;
    }
}
