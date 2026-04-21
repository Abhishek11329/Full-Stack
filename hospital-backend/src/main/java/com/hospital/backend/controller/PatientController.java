package com.hospital.backend.controller;

import com.hospital.backend.dto.request.AppointmentRequest;
import com.hospital.backend.dto.response.MessageResponse;
import com.hospital.backend.entity.Appointment;
import com.hospital.backend.entity.Doctor;
import com.hospital.backend.entity.User;
import com.hospital.backend.repository.DoctorRepository;
import com.hospital.backend.repository.UserRepository;
import com.hospital.backend.service.AppointmentService;
import com.hospital.backend.service.MedicalRecordService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentService appointmentService;
    private final MedicalRecordService medicalRecordService;

    public PatientController(UserRepository userRepository, DoctorRepository doctorRepository, AppointmentService appointmentService, MedicalRecordService medicalRecordService) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentService = appointmentService;
        this.medicalRecordService = medicalRecordService;
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorRepository.findAll());
    }

    @PostMapping("/appointments")
    public ResponseEntity<?> bookAppointment(@RequestBody AppointmentRequest request) {
        try {
            Long userId = getLoggedInUserId();
            Appointment appt = appointmentService.bookAppointment(userId, request);
            return ResponseEntity.ok(appt);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/appointments")
    public ResponseEntity<?> getAppointments() {
        try {
            return ResponseEntity.ok(appointmentService.getPatientAppointments(getLoggedInUserId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/records")
    public ResponseEntity<?> getRecords() {
        try {
            return ResponseEntity.ok(medicalRecordService.getPatientRecords(getLoggedInUserId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    private Long getLoggedInUserId() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        return user.getId();
    }
}
