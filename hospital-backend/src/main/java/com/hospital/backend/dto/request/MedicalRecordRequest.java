package com.hospital.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class MedicalRecordRequest {
    @NotNull
    private Long appointmentId;

    @NotBlank
    private String diagnosis;

    @NotBlank
    private String prescription;

    private String notes;

    public Long getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }

    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }

    public String getPrescription() { return prescription; }
    public void setPrescription(String prescription) { this.prescription = prescription; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
