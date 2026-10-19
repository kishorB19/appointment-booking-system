package com.example.appointment_backend.repository;

import com.example.appointment_backend.model.Appointment;
import com.example.appointment_backend.model.AppointmentStatus;
import com.example.appointment_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientOrderByAppointmentDateDesc(User patient);
    List<Appointment> findByDoctorOrderByAppointmentDateDesc(User doctor);
    List<Appointment> findByDoctorAndAppointmentDate(User doctor, LocalDate appointmentDate);
    List<Appointment> findByDoctorAndStatus(User doctor, AppointmentStatus status);
}
