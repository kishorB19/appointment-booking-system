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
        System.out.println(">>> Checking and initializing demo data...");

        // Ensure Patient exists
        User patient = userRepository.findByEmail("patient@demo.com").orElse(null);
        if (patient == null) {
            patient = new User(
                    "patient@demo.com",
                    passwordEncoder.encode("password123"),
                    "Arjun Patel",
                    "+91 98765 43210",
                    Role.PATIENT
            );
            userRepository.save(patient);
        } else if ("Alex Taylor".equalsIgnoreCase(patient.getFullName())) {
            patient.setFullName("Arjun Patel");
            patient.setPhone("+91 98765 43210");
            userRepository.save(patient);
        }

        // Doctor 1: Cardiology (Dr. Ananya Iyer)
        User doc1 = userRepository.findByEmail("doctor.ananya@demo.com")
                .or(() -> userRepository.findByEmail("doctor.sarah@demo.com"))
                .orElse(null);
        if (doc1 == null) {
            doc1 = new User("doctor.ananya@demo.com", passwordEncoder.encode("password123"), "Dr. Ananya Iyer", "+91 97654 32109", Role.DOCTOR);
            userRepository.save(doc1);
        } else {
            doc1.setEmail("doctor.ananya@demo.com");
            doc1.setFullName("Dr. Ananya Iyer");
            doc1.setPhone("+91 97654 32109");
            userRepository.save(doc1);
        }
        User finalDoc1 = doc1;
        DoctorProfile prof1 = doctorProfileRepository.findByUserId(finalDoc1.getId())
                .orElseGet(() -> new DoctorProfile(finalDoc1, "Cardiology", 12, 75.0, "Board-certified cardiologist specializing in preventive cardiology, hypertension, and advanced heart health."));
        prof1.setSpecialization("Cardiology");
        prof1.setAvailableDays("Monday,Tuesday,Wednesday,Thursday,Friday");
        prof1.setWorkingHoursStart("09:00");
        prof1.setWorkingHoursEnd("17:00");
        prof1.setRating(4.9);
        prof1.setClinicAddress("Shree Heart & Vascular Center, Banjara Hills");
        doctorProfileRepository.save(prof1);

        // Doctor 2: Dermatology (Dr. Vikram Deshmukh)
        User doc2 = userRepository.findByEmail("doctor.vikram@demo.com")
                .or(() -> userRepository.findByEmail("doctor.robert@demo.com"))
                .orElse(null);
        if (doc2 == null) {
            doc2 = new User("doctor.vikram@demo.com", passwordEncoder.encode("password123"), "Dr. Vikram Deshmukh", "+91 96543 21098", Role.DOCTOR);
            userRepository.save(doc2);
        } else {
            doc2.setEmail("doctor.vikram@demo.com");
            doc2.setFullName("Dr. Vikram Deshmukh");
            doc2.setPhone("+91 96543 21098");
            userRepository.save(doc2);
        }
        User finalDoc2 = doc2;
        DoctorProfile prof2 = doctorProfileRepository.findByUserId(finalDoc2.getId())
                .orElseGet(() -> new DoctorProfile(finalDoc2, "Dermatology", 8, 60.0, "Specializing in medical, surgical, and cosmetic dermatology with patient-first precision."));
        prof2.setSpecialization("Dermatology");
        prof2.setAvailableDays("Monday,Wednesday,Thursday,Saturday");
        prof2.setWorkingHoursStart("10:00");
        prof2.setWorkingHoursEnd("18:00");
        prof2.setRating(4.8);
        prof2.setClinicAddress("Radiant Skin Clinic, MG Road, Pune");
        doctorProfileRepository.save(prof2);

        // Doctor 3: Pediatrics (Dr. Meera Krishnan)
        User doc3 = userRepository.findByEmail("doctor.meera@demo.com")
                .or(() -> userRepository.findByEmail("doctor.priya@demo.com"))
                .orElse(null);
        if (doc3 == null) {
            doc3 = new User("doctor.meera@demo.com", passwordEncoder.encode("password123"), "Dr. Meera Krishnan", "+91 95432 10987", Role.DOCTOR);
            userRepository.save(doc3);
        } else {
            doc3.setEmail("doctor.meera@demo.com");
            doc3.setFullName("Dr. Meera Krishnan");
            doc3.setPhone("+91 95432 10987");
            userRepository.save(doc3);
        }
        User finalDoc3 = doc3;
        DoctorProfile prof3 = doctorProfileRepository.findByUserId(finalDoc3.getId())
                .orElseGet(() -> new DoctorProfile(finalDoc3, "Pediatrics", 10, 55.0, "Compassionate pediatrician devoted to child wellness, immunization, and newborn development."));
        prof3.setSpecialization("Pediatrics");
        prof3.setAvailableDays("Monday,Tuesday,Wednesday,Friday");
        prof3.setWorkingHoursStart("08:30");
        prof3.setWorkingHoursEnd("16:30");
        prof3.setRating(4.9);
        prof3.setClinicAddress("Little Stars Children's Clinic, Koramangala");
        doctorProfileRepository.save(prof3);

        // Doctor 4: Neurology (Dr. Rajesh Nair)
        User doc4 = userRepository.findByEmail("doctor.rajesh@demo.com")
                .or(() -> userRepository.findByEmail("doctor.marcus@demo.com"))
                .orElse(null);
        if (doc4 == null) {
            doc4 = new User("doctor.rajesh@demo.com", passwordEncoder.encode("password123"), "Dr. Rajesh Nair", "+91 94321 09876", Role.DOCTOR);
            userRepository.save(doc4);
        } else {
            doc4.setEmail("doctor.rajesh@demo.com");
            doc4.setFullName("Dr. Rajesh Nair");
            doc4.setPhone("+91 94321 09876");
            userRepository.save(doc4);
        }
        User finalDoc4 = doc4;
        DoctorProfile prof4 = doctorProfileRepository.findByUserId(finalDoc4.getId())
                .orElseGet(() -> new DoctorProfile(finalDoc4, "Neurology", 15, 90.0, "Expert neurologist focused on migraines, neurological diagnostic care, and neuro-rehabilitation."));
        prof4.setSpecialization("Neurology");
        prof4.setAvailableDays("Tuesday,Thursday,Friday");
        prof4.setWorkingHoursStart("09:00");
        prof4.setWorkingHoursEnd("15:00");
        prof4.setRating(4.7);
        prof4.setClinicAddress("Neuro Life Institute, Jubilee Hills");
        doctorProfileRepository.save(prof4);

        // Seed sample appointments if none exist
        if (appointmentRepository.count() == 0) {
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
        }

        System.out.println(">>> Demo data successfully seeded and verified!");
    }
}
