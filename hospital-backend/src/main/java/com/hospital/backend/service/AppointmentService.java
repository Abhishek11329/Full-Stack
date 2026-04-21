package com.hospital.backend.service;

import com.hospital.backend.dto.request.AppointmentRequest;
import com.hospital.backend.entity.Appointment;
import com.hospital.backend.entity.Doctor;
import com.hospital.backend.entity.Patient;
import com.hospital.backend.enums.Status;
import com.hospital.backend.repository.AppointmentRepository;
import com.hospital.backend.repository.DoctorRepository;
import com.hospital.backend.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final EmailService emailService;

    public AppointmentService(AppointmentRepository appointmentRepository, DoctorRepository doctorRepository, PatientRepository patientRepository, EmailService emailService) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.emailService = emailService;
    }

    @SuppressWarnings("null")
    public Appointment bookAppointment(Long userId, AppointmentRequest request) {
        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Patient profile not found."));
        
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found."));

        boolean isDoubleBooked = appointmentRepository.existsByDoctorIdAndAppointmentDateAndTimeSlotAndStatusNot(
                doctor.getId(), request.getAppointmentDate(), request.getTimeSlot(), Status.CANCELLED);

        if (isDoubleBooked) {
            throw new RuntimeException("This time slot is already booked for the selected doctor.");
        }

        Appointment appointment = new Appointment(patient, doctor, request.getAppointmentDate(), request.getTimeSlot(), Status.PENDING);
        Appointment savedAppt = appointmentRepository.save(appointment);
        
        // Trigger Email Simulation
        emailService.simulateSendingEmail(
                patient.getUser().getUsername(),
                "Appointment " + Status.PENDING,
                "Dear " + patient.getName() + ",\nYour appointment with Dr. " + doctor.getName() + " is pending confirmation for " + request.getAppointmentDate() + " at " + request.getTimeSlot() + "."
        );
        
        return savedAppt;
    }

    public List<Appointment> getPatientAppointments(Long userId) {
        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Patient profile not found."));
        return appointmentRepository.findByPatientId(patient.getId());
    }

    public List<Appointment> getDoctorAppointments(Long userId) {
        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found."));
        return appointmentRepository.findByDoctorId(doctor.getId());
    }

    @SuppressWarnings("null")
    public Appointment updateStatus(Long appointmentId, Status newStatus) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found."));
        appointment.setStatus(newStatus);
        Appointment savedAppt = appointmentRepository.save(appointment);
        
        emailService.simulateSendingEmail(
                appointment.getPatient().getUser().getUsername(),
                "Appointment Status Update: " + newStatus,
                "Dear " + appointment.getPatient().getName() + ",\nYour appointment with Dr. " + appointment.getDoctor().getName() + " has been marked as: " + newStatus + "."
        );
        
        return savedAppt;
    }
}
