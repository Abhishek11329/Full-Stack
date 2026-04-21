package com.hospital.backend.controller;

import com.hospital.backend.dto.request.MedicalRecordRequest;
import com.hospital.backend.dto.response.MessageResponse;
import com.hospital.backend.entity.User;
import com.hospital.backend.enums.Status;
import com.hospital.backend.repository.UserRepository;
import com.hospital.backend.service.AppointmentService;
import com.hospital.backend.service.MedicalRecordService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final AppointmentService appointmentService;
    private final MedicalRecordService medicalRecordService;
    private final UserRepository userRepository;

    public DoctorController(AppointmentService appointmentService, MedicalRecordService medicalRecordService, UserRepository userRepository) {
        this.appointmentService = appointmentService;
        this.medicalRecordService = medicalRecordService;
        this.userRepository = userRepository;
    }

    @GetMapping("/appointments")
    public ResponseEntity<?> getAppointments() {
        try {
            return ResponseEntity.ok(appointmentService.getDoctorAppointments(getLoggedInUserId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PatchMapping("/appointments/{id}/status")
    public ResponseEntity<?> updateAppointmentStatus(@PathVariable Long id, @RequestParam Status status) {
        try {
            return ResponseEntity.ok(appointmentService.updateStatus(id, status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/records")
    public ResponseEntity<?> addMedicalRecord(@RequestBody MedicalRecordRequest request) {
        try {
            return ResponseEntity.ok(medicalRecordService.createRecord(getLoggedInUserId(), request));
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
