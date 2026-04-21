package com.hospital.backend.entity;

import com.hospital.backend.enums.Status;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    private LocalDate appointmentDate;
    
    // Simplification: e.g., "10:00 AM", "14:30"
    private String timeSlot;

    @Enumerated(EnumType.STRING)
    private Status status;

    public Appointment() {
    }

    public Appointment(Patient patient, Doctor doctor, LocalDate appointmentDate, String timeSlot, Status status) {
        this.patient = patient;
        this.doctor = doctor;
        this.appointmentDate = appointmentDate;
        this.timeSlot = timeSlot;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public Doctor getDoctor() { return doctor; }
    public void setDoctor(Doctor doctor) { this.doctor = doctor; }

    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
}
