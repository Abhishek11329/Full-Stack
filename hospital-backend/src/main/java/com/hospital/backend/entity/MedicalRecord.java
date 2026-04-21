package com.hospital.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "medical_records")
public class MedicalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @OneToOne
    @JoinColumn(name = "appointment_id", referencedColumnName = "id", nullable = true)
    private Appointment appointment;

    private String diagnosis;
    
    @Column(columnDefinition = "TEXT")
    private String prescription;
    
    @Column(columnDefinition = "TEXT")
    private String notes;

    private LocalDate visitDate;

    public MedicalRecord() {
    }

    public MedicalRecord(Patient patient, Doctor doctor, Appointment appointment, String diagnosis, String prescription, String notes, LocalDate visitDate) {
        this.patient = patient;
        this.doctor = doctor;
        this.appointment = appointment;
        this.diagnosis = diagnosis;
        this.prescription = prescription;
        this.notes = notes;
        this.visitDate = visitDate;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public Doctor getDoctor() { return doctor; }
    public void setDoctor(Doctor doctor) { this.doctor = doctor; }

    public Appointment getAppointment() { return appointment; }
    public void setAppointment(Appointment appointment) { this.appointment = appointment; }

    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }

    public String getPrescription() { return prescription; }
    public void setPrescription(String prescription) { this.prescription = prescription; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDate getVisitDate() { return visitDate; }
    public void setVisitDate(LocalDate visitDate) { this.visitDate = visitDate; }
}
