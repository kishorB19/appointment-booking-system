package com.example.appointment_backend.controller;

import com.example.appointment_backend.dto.AuthResponse;
import com.example.appointment_backend.dto.LoginRequest;
import com.example.appointment_backend.dto.RegisterRequest;
import com.example.appointment_backend.model.DoctorProfile;
import com.example.appointment_backend.model.Role;
import com.example.appointment_backend.model.User;
import com.example.appointment_backend.repository.DoctorProfileRepository;
import com.example.appointment_backend.repository.UserRepository;
import com.example.appointment_backend.security.JwtUtils;
import com.example.appointment_backend.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthController(AuthenticationManager authenticationManager,
                          UserRepository userRepository,
                          DoctorProfileRepository doctorProfileRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.doctorProfileRepository = doctorProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        String jwt = jwtUtils.generateJwtToken(userDetails.getUsername(), userDetails.getRole().name());

        Long doctorProfileId = null;
        if (userDetails.getRole() == Role.DOCTOR) {
            doctorProfileId = doctorProfileRepository.findByUserId(userDetails.getId())
                    .map(DoctorProfile::getId)
                    .orElse(null);
        }

        User user = userRepository.findById(userDetails.getId()).orElse(null);
        String phone = user != null ? user.getPhone() : "";

        return ResponseEntity.ok(new AuthResponse(
                jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getFullName(),
                phone,
                userDetails.getRole(),
                doctorProfileId
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Email is already registered!"));
        }

        User user = new User(
                registerRequest.getEmail(),
                passwordEncoder.encode(registerRequest.getPassword()),
                registerRequest.getFullName(),
                registerRequest.getPhone(),
                registerRequest.getRole()
        );

        userRepository.save(user);

        Long doctorProfileId = null;
        if (user.getRole() == Role.DOCTOR) {
            DoctorProfile profile = new DoctorProfile(
                    user,
                    registerRequest.getSpecialization() != null && !registerRequest.getSpecialization().isBlank()
                            ? registerRequest.getSpecialization() : "General Physician",
                    registerRequest.getExperienceYears() != null ? registerRequest.getExperienceYears() : 5,
                    registerRequest.getConsultationFee() != null ? registerRequest.getConsultationFee() : 50.0,
                    registerRequest.getBio() != null ? registerRequest.getBio() : "Dedicated medical professional committed to patient care."
            );
            if (registerRequest.getClinicAddress() != null && !registerRequest.getClinicAddress().isBlank()) {
                profile.setClinicAddress(registerRequest.getClinicAddress());
            }
            DoctorProfile saved = doctorProfileRepository.save(profile);
            doctorProfileId = saved.getId();
        }

        String jwt = jwtUtils.generateJwtToken(user.getEmail(), user.getRole().name());

        return ResponseEntity.ok(new AuthResponse(
                jwt,
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                user.getRole(),
                doctorProfileId
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
        }

        User user = userRepository.findById(userDetails.getId()).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        Long doctorProfileId = null;
        if (user.getRole() == Role.DOCTOR) {
            doctorProfileId = doctorProfileRepository.findByUserId(user.getId())
                    .map(DoctorProfile::getId)
                    .orElse(null);
        }

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "fullName", user.getFullName(),
                "phone", user.getPhone() != null ? user.getPhone() : "",
                "role", user.getRole(),
                "doctorProfileId", doctorProfileId != null ? doctorProfileId : ""
        ));
    }
}
