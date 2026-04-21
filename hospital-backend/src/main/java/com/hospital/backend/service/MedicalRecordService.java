package com.hospital.backend.service;

import com.hospital.backend.dto.request.MedicalRecordRequest;
import com.hospital.backend.entity.Appointment;
import com.hospital.backend.entity.Doctor;
import com.hospital.backend.entity.MedicalRecord;
import com.hospital.backend.entity.Patient;
import com.hospital.backend.enums.Status;
import com.hospital.backend.repository.AppointmentRepository;
import com.hospital.backend.repository.DoctorRepository;
import com.hospital.backend.repository.MedicalRecordRepository;
import com.hospital.backend.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class MedicalRecordService {

    private final MedicalRecordRepository recordRepository;
    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final EmailService emailService;

    public MedicalRecordService(MedicalRecordRepository recordRepository, AppointmentRepository appointmentRepository, PatientRepository patientRepository, DoctorRepository doctorRepository, EmailService emailService) {
        this.recordRepository = recordRepository;
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.emailService = emailService;
    }

    @SuppressWarnings("null")
    public MedicalRecord createRecord(Long doctorUserId, MedicalRecordRequest request) {
        Doctor doctor = doctorRepository.findByUserId(doctorUserId)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found."));

        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Appointment not found."));

        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            throw new RuntimeException("Not authorized to write records for other doctors' appointments.");
        }

        MedicalRecord record = new MedicalRecord(
                appointment.getPatient(), 
                doctor, 
                appointment, 
                request.getDiagnosis(), 
                request.getPrescription(), 
                request.getNotes(), 
                LocalDate.now()
        );

        appointment.setStatus(Status.COMPLETED);
        appointmentRepository.save(appointment);

        MedicalRecord savedRecord = recordRepository.save(record);
        
        // Trigger simulated email for new medical record & prescription
        emailService.simulateSendingEmail(
                appointment.getPatient().getUser().getUsername(),
                "New Medical Record & Prescription Available from Dr. " + doctor.getName(),
                "Dear " + appointment.getPatient().getName() + ",\nYour medical record from the visit on " + appointment.getAppointmentDate() + " has been updated.\nDiagnosis: " + request.getDiagnosis() + "\nPlease log in to download your prescription PDF."
        );
        
        return savedRecord;
    }

    public List<MedicalRecord> getPatientRecords(Long patientUserId) {
        Patient patient = patientRepository.findByUserId(patientUserId)
                .orElseThrow(() -> new RuntimeException("Patient profile not found."));
        return recordRepository.findByPatientId(patient.getId());
    }
}
