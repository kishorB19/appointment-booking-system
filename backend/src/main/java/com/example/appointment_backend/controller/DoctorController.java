package com.example.appointment_backend.controller;

import com.example.appointment_backend.dto.DoctorAvailabilityRequest;
import com.example.appointment_backend.dto.DoctorDto;
import com.example.appointment_backend.model.DoctorProfile;
import com.example.appointment_backend.model.Role;
import com.example.appointment_backend.model.User;
import com.example.appointment_backend.repository.DoctorProfileRepository;
import com.example.appointment_backend.repository.UserRepository;
import com.example.appointment_backend.security.UserDetailsImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorProfileRepository doctorProfileRepository;
    private final UserRepository userRepository;

    public DoctorController(DoctorProfileRepository doctorProfileRepository, UserRepository userRepository) {
        this.doctorProfileRepository = doctorProfileRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<DoctorDto>> getAllDoctors(@RequestParam(required = false) String specialization) {
        List<DoctorProfile> profiles;
        if (specialization != null && !specialization.isBlank()) {
            profiles = doctorProfileRepository.findBySpecializationContainingIgnoreCase(specialization);
        } else {
            profiles = doctorProfileRepository.findAll();
        }

        List<DoctorDto> dtos = profiles.stream()
                .filter(p -> p.getUser() != null && p.getUser().getRole() == Role.DOCTOR)
                .map(DoctorDto::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDoctorById(@PathVariable Long id) {
        return doctorProfileRepository.findByUserId(id)
                .map(p -> ResponseEntity.ok(new DoctorDto(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/specializations")
    public ResponseEntity<List<String>> getSpecializations() {
        List<String> specializations = doctorProfileRepository.findAll().stream()
                .map(DoctorProfile::getSpecialization)
                .filter(s -> s != null && !s.isBlank())
                .distinct()
                .sorted()
                .collect(Collectors.toList());

        return ResponseEntity.ok(specializations);
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> updateProfileAndAvailability(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody DoctorAvailabilityRequest request) {

        User user = userRepository.findById(userDetails.getId()).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        DoctorProfile profile = doctorProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> new DoctorProfile(user, "General Physician", 5, 50.0, ""));

        if (request.getSpecialization() != null && !request.getSpecialization().isBlank()) {
            profile.setSpecialization(request.getSpecialization());
        }
        if (request.getExperienceYears() != null) {
            profile.setExperienceYears(request.getExperienceYears());
        }
        if (request.getConsultationFee() != null) {
            profile.setConsultationFee(request.getConsultationFee());
        }
        if (request.getBio() != null) {
            profile.setBio(request.getBio());
        }
        if (request.getAvailableDays() != null && !request.getAvailableDays().isBlank()) {
            profile.setAvailableDays(request.getAvailableDays());
        }
        if (request.getWorkingHoursStart() != null && !request.getWorkingHoursStart().isBlank()) {
            profile.setWorkingHoursStart(request.getWorkingHoursStart());
        }
        if (request.getWorkingHoursEnd() != null && !request.getWorkingHoursEnd().isBlank()) {
            profile.setWorkingHoursEnd(request.getWorkingHoursEnd());
        }
        if (request.getClinicAddress() != null && !request.getClinicAddress().isBlank()) {
            profile.setClinicAddress(request.getClinicAddress());
        }

        DoctorProfile saved = doctorProfileRepository.save(profile);
        return ResponseEntity.ok(new DoctorDto(saved));
    }
}
