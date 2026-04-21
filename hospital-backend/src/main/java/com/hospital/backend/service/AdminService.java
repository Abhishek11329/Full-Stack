package com.hospital.backend.service;

import com.hospital.backend.repository.AppointmentRepository;
import com.hospital.backend.repository.DoctorRepository;
import com.hospital.backend.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
public class AdminService {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;

    public AdminService(PatientRepository patientRepository, DoctorRepository doctorRepository, AppointmentRepository appointmentRepository) {
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public Map<String, Object> getSystemStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalPatients = patientRepository.count();
        long totalDoctors = doctorRepository.count();
        long totalAppointments = appointmentRepository.count();
        
        // Count today's appointments
        long todaysAppointments = appointmentRepository.findAll().stream()
                .filter(a -> a.getAppointmentDate().equals(LocalDate.now()))
                .count();

        stats.put("totalPatients", totalPatients);
        stats.put("totalDoctors", totalDoctors);
        stats.put("totalAppointments", totalAppointments);
        stats.put("todaysAppointments", todaysAppointments);
        
        return stats;
    }
}
