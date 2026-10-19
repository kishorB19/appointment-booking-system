package com.example.appointment_backend.dto;

import com.example.appointment_backend.model.DoctorProfile;

public class DoctorDto {
    private Long id; // doctor user id
    private Long profileId;
    private String fullName;
    private String email;
    private String phone;
    private String specialization;
    private Integer experienceYears;
    private Double consultationFee;
    private String bio;
    private String availableDays;
    private String workingHoursStart;
    private String workingHoursEnd;
    private Double rating;
    private String clinicAddress;

    public DoctorDto() {}

    public DoctorDto(DoctorProfile profile) {
        if (profile != null) {
            this.profileId = profile.getId();
            if (profile.getUser() != null) {
                this.id = profile.getUser().getId();
                this.fullName = profile.getUser().getFullName();
                this.email = profile.getUser().getEmail();
                this.phone = profile.getUser().getPhone();
            }
            this.specialization = profile.getSpecialization();
            this.experienceYears = profile.getExperienceYears();
            this.consultationFee = profile.getConsultationFee();
            this.bio = profile.getBio();
            this.availableDays = profile.getAvailableDays();
            this.workingHoursStart = profile.getWorkingHoursStart();
            this.workingHoursEnd = profile.getWorkingHoursEnd();
            this.rating = profile.getRating();
            this.clinicAddress = profile.getClinicAddress();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProfileId() {
        return profileId;
    }

    public void setProfileId(Long profileId) {
        this.profileId = profileId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }

    public Double getConsultationFee() {
        return consultationFee;
    }

    public void setConsultationFee(Double consultationFee) {
        this.consultationFee = consultationFee;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getAvailableDays() {
        return availableDays;
    }

    public void setAvailableDays(String availableDays) {
        this.availableDays = availableDays;
    }

    public String getWorkingHoursStart() {
        return workingHoursStart;
    }

    public void setWorkingHoursStart(String workingHoursStart) {
        this.workingHoursStart = workingHoursStart;
    }

    public String getWorkingHoursEnd() {
        return workingHoursEnd;
    }

    public void setWorkingHoursEnd(String workingHoursEnd) {
        this.workingHoursEnd = workingHoursEnd;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getClinicAddress() {
        return clinicAddress;
    }

    public void setClinicAddress(String clinicAddress) {
        this.clinicAddress = clinicAddress;
    }
}
