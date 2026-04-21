package com.hospital.backend.config;

import com.hospital.backend.entity.Doctor;
import com.hospital.backend.entity.Patient;
import com.hospital.backend.entity.User;
import com.hospital.backend.enums.Role;
import com.hospital.backend.repository.DoctorRepository;
import com.hospital.backend.repository.PatientRepository;
import com.hospital.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, DoctorRepository doctorRepository, PatientRepository patientRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByUsername("admin@hospital.com")) {
            User admin = new User("admin@hospital.com", passwordEncoder.encode("admin123"), Role.ROLE_ADMIN);
            userRepository.save(admin);
            System.out.println("Admin seeded successfully.");
        }

        if (!userRepository.existsByUsername("doctor@hospital.com")) {
            User doctorUser = new User("doctor@hospital.com", passwordEncoder.encode("doctor123"), Role.ROLE_DOCTOR);
            User savedDocUser = userRepository.save(doctorUser);
            Doctor doctor = new Doctor(savedDocUser, "Dr. Smith", "Cardiology", 10, "123-456-7890", 150);
            doctorRepository.save(doctor);
            
            // Adding extra doctors
            User d2 = userRepository.save(new User("doc.jones@hospital.com", passwordEncoder.encode("doctor123"), Role.ROLE_DOCTOR));
            doctorRepository.save(new Doctor(d2, "Dr. Jones", "Neurology", 15, "123-456-7891", 200));
            
            User d3 = userRepository.save(new User("doc.williams@hospital.com", passwordEncoder.encode("doctor123"), Role.ROLE_DOCTOR));
            doctorRepository.save(new Doctor(d3, "Dr. Williams", "Pediatrics", 8, "123-456-7892", 100));
            
            User d4 = userRepository.save(new User("doc.brown@hospital.com", passwordEncoder.encode("doctor123"), Role.ROLE_DOCTOR));
            doctorRepository.save(new Doctor(d4, "Dr. Brown", "Orthopedics", 20, "123-456-7893", 250));
            
            User d5 = userRepository.save(new User("doc.davis@hospital.com", passwordEncoder.encode("doctor123"), Role.ROLE_DOCTOR));
            doctorRepository.save(new Doctor(d5, "Dr. Davis", "General Practice", 5, "123-456-7894", 50));
            
            System.out.println("Doctors seeded successfully.");
        }
        
        if (!userRepository.existsByUsername("patient@hospital.com")) {
            User patientUser = new User("patient@hospital.com", passwordEncoder.encode("patient123"), Role.ROLE_PATIENT);
            User savedPatUser = userRepository.save(patientUser);
            
            Patient patient = new Patient(savedPatUser, "John Doe", 30, "Male", "123 Health Ave", "098-765-4321", "O+");
            patientRepository.save(patient);
            System.out.println("Patient seeded successfully.");
        }
    }
}
