package com.example.appointment_backend.dto;

import com.example.appointment_backend.model.AppointmentStatus;
import jakarta.validation.constraints.NotNull;

public class AppointmentStatusRequest {
    @NotNull
    private AppointmentStatus status;

    private String cancellationReason;

    public AppointmentStatusRequest() {}

    public AppointmentStatus getStatus() {
        return status;
    }

    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }

    public String getCancellationReason() {
        return cancellationReason;
    }

    public void setCancellationReason(String cancellationReason) {
        this.cancellationReason = cancellationReason;
    }
}
