package com.example.appointment_backend.dto;

import jakarta.validation.constraints.NotBlank;

public class PrescriptionRequest {
    @NotBlank
    private String diagnosis;

    @NotBlank
    private String medicines;

    private String instructions;

    private String notes;

    public PrescriptionRequest() {}

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
}
