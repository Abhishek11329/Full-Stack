package com.hospital.backend.controller;

import com.hospital.backend.dto.request.LoginRequest;
import com.hospital.backend.dto.request.SignupRequest;
import com.hospital.backend.dto.response.JwtResponse;
import com.hospital.backend.dto.response.MessageResponse;
import com.hospital.backend.entity.Doctor;
import com.hospital.backend.entity.Patient;
import com.hospital.backend.entity.User;
import com.hospital.backend.enums.Role;
import com.hospital.backend.repository.DoctorRepository;
import com.hospital.backend.repository.PatientRepository;
import com.hospital.backend.repository.UserRepository;
import com.hospital.backend.security.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository,
                          PatientRepository patientRepository, DoctorRepository doctorRepository,
                          PasswordEncoder encoder, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                user.getId(),
                userDetails.getUsername(),
                roles));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username (Email) is already taken!"));
        }

        Role role = Role.ROLE_PATIENT;
        if(signUpRequest.getRole() != null) {
            String requestedRole = signUpRequest.getRole().toUpperCase();
            if(requestedRole.equals("DOCTOR") || requestedRole.equals("ROLE_DOCTOR")) {
                role = Role.ROLE_DOCTOR;
            } else if (requestedRole.equals("ADMIN") || requestedRole.equals("ROLE_ADMIN")) {
                role = Role.ROLE_ADMIN;
            }
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                encoder.encode(signUpRequest.getPassword()),
                role);

        User savedUser = userRepository.save(user);

        // Save related specialized profile
        if (role == Role.ROLE_PATIENT) {
            String bG = signUpRequest.getBloodGroup() != null ? signUpRequest.getBloodGroup() : "Unknown";
            Patient patient = new Patient(savedUser, signUpRequest.getName(), signUpRequest.getAge(),
                    signUpRequest.getGender(), signUpRequest.getAddress(), signUpRequest.getPhone(), bG);
            patientRepository.save(patient);
        } else if (role == Role.ROLE_DOCTOR) {
            String docName = signUpRequest.getName() != null ? signUpRequest.getName() : "Dr. Default";
            String specialty = signUpRequest.getSpecialty() != null ? signUpRequest.getSpecialty() : "General";
            Integer exp = signUpRequest.getExperience() != null ? signUpRequest.getExperience() : 0;
            String phone = signUpRequest.getPhone() != null ? signUpRequest.getPhone() : "N/A";
            Integer fee = signUpRequest.getConsultationFee() != null ? signUpRequest.getConsultationFee() : 100;
            
            Doctor doctor = new Doctor(savedUser, docName, specialty, exp, phone, fee);
            doctorRepository.save(doctor);
        }

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
