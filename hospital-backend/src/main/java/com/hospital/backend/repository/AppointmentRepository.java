package com.hospital.backend.repository;

import com.hospital.backend.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDoctorId(Long doctorId);
    boolean existsByDoctorIdAndAppointmentDateAndTimeSlotAndStatusNot(Long doctorId, LocalDate appointmentDate, String timeSlot, com.hospital.backend.enums.Status status);
}
