package com.example.appointment_backend.config;

import com.example.appointment_backend.model.*;
import com.example.appointment_backend.repository.AppointmentRepository;
import com.example.appointment_backend.repository.DoctorProfileRepository;
import com.example.appointment_backend.repository.PrescriptionRepository;
import com.example.appointment_backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final AppointmentRepository appointmentRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           DoctorProfileRepository doctorProfileRepository,
                           AppointmentRepository appointmentRepository,
                           PrescriptionRepository prescriptionRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.doctorProfileRepository = doctorProfileRepository;
        this.appointmentRepository = appointmentRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return;
        }

        System.out.println(">>> Initializing Demo Data for Patients and Doctors...");

        // Create Demo Patient
        User patient = new User(
                "patient@demo.com",
                passwordEncoder.encode("password123"),
                "Alex Taylor",
                "+1 (555) 234-5678",
                Role.PATIENT
        );
        userRepository.save(patient);

        // Create Demo Doctor 1: Cardiology
        User doc1 = new User(
                "doctor.sarah@demo.com",
                passwordEncoder.encode("password123"),
                "Dr. Sarah Jenkins",
                "+1 (555) 432-8765",
                Role.DOCTOR
        );
        userRepository.save(doc1);
        DoctorProfile prof1 = new DoctorProfile(
                doc1,
                "Cardiology",
                12,
                75.0,
                "Board-certified cardiologist specializing in preventive cardiology, hypertension, and advanced heart health."
        );
        prof1.setAvailableDays("Monday,Tuesday,Wednesday,Thursday,Friday");
        prof1.setWorkingHoursStart("09:00");
        prof1.setWorkingHoursEnd("17:00");
        prof1.setRating(4.9);
        prof1.setClinicAddress("Apex Heart & Vascular Center, Suite 300");
        doctorProfileRepository.save(prof1);

        // Create Demo Doctor 2: Dermatology
        User doc2 = new User(
                "doctor.robert@demo.com",
                passwordEncoder.encode("password123"),
                "Dr. Robert Chen",
                "+1 (555) 678-1234",
                Role.DOCTOR
        );
        userRepository.save(doc2);
        DoctorProfile prof2 = new DoctorProfile(
                doc2,
                "Dermatology",
                8,
                60.0,
                "Specializing in medical, surgical, and cosmetic dermatology with patient-first precision."
        );
        prof2.setAvailableDays("Monday,Wednesday,Thursday,Saturday");
        prof2.setWorkingHoursStart("10:00");
        prof2.setWorkingHoursEnd("18:00");
        prof2.setRating(4.8);
        prof2.setClinicAddress("ClearSkin Dermatology Center, Room 102");
        doctorProfileRepository.save(prof2);

        // Create Demo Doctor 3: Pediatrics
        User doc3 = new User(
                "doctor.priya@demo.com",
                passwordEncoder.encode("password123"),
                "Dr. Priya Sharma",
                "+1 (555) 789-4561",
                Role.DOCTOR
        );
        userRepository.save(doc3);
        DoctorProfile prof3 = new DoctorProfile(
                doc3,
                "Pediatrics",
                10,
                55.0,
                "Compassionate pediatrician devoted to child wellness, immunization, and newborn development."
        );
        prof3.setAvailableDays("Monday,Tuesday,Wednesday,Friday");
        prof3.setWorkingHoursStart("08:30");
        prof3.setWorkingHoursEnd("16:30");
        prof3.setRating(4.9);
        prof3.setClinicAddress("Little Wonders Pediatric Clinic, Floor 2");
        doctorProfileRepository.save(prof3);

        // Create Demo Doctor 4: Neurology
        User doc4 = new User(
                "doctor.marcus@demo.com",
                passwordEncoder.encode("password123"),
                "Dr. Marcus Vance",
                "+1 (555) 987-6543",
                Role.DOCTOR
        );
        userRepository.save(doc4);
        DoctorProfile prof4 = new DoctorProfile(
                doc4,
                "Neurology",
                15,
                90.0,
                "Expert neurologist focused on migraines, neurological diagnostic care, and neuro-rehabilitation."
        );
        prof4.setAvailableDays("Tuesday,Thursday,Friday");
        prof4.setWorkingHoursStart("09:00");
        prof4.setWorkingHoursEnd("15:00");
        prof4.setRating(4.7);
        prof4.setClinicAddress("Metro Neuro & Brain Institute, Suite 501");
        doctorProfileRepository.save(prof4);

        // Seed sample appointments
        Appointment apt1 = new Appointment(
                patient,
                doc1,
                LocalDate.now().plusDays(2),
                "10:00 AM",
                "Regular cardiac checkup and blood pressure assessment"
        );
        apt1.setStatus(AppointmentStatus.CONFIRMED);
        appointmentRepository.save(apt1);

        Appointment apt2 = new Appointment(
                patient,
                doc2,
                LocalDate.now().minusDays(3),
                "02:30 PM",
                "Consultation regarding persistent skin rash on right arm"
        );
        apt2.setStatus(AppointmentStatus.COMPLETED);
        appointmentRepository.save(apt2);

        // Seed prescription for completed appointment apt2
        Prescription presc = new Prescription(
                apt2,
                "Contact Dermatitis with mild allergic irritation",
                "Hydrocortisone cream 1% (apply thin layer 2x daily for 7 days); Cetirizine 10mg (1 tablet at bedtime for 5 days)",
                "Avoid harsh soaps and hot water baths. Keep skin moisturized with gentle hypoallergenic lotion.",
                "Patient responded well to initial exam. Follow up in 10 days if symptoms persist."
        );
        prescriptionRepository.save(presc);

        System.out.println(">>> Demo data successfully seeded! Patient: patient@demo.com | Doctors: doctor.sarah@demo.com, etc.");
    }
}
