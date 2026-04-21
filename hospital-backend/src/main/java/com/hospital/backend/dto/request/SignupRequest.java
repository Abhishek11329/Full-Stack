package com.hospital.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SignupRequest {
    @NotBlank
    @Size(min = 3, max = 50)
    @Email
    private String username;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    // Optional role for admin creation of doctors. Default is PATIENT in logic.
    private String role;

    // Patient or Doctor standard details
    private String name;
    private String phone;
    
    // Patient specific
    private Integer age;
    private String gender;
    private String address;

    // Doctor specific
    private String specialty;
    private Integer experience;
    
    private String bloodGroup;
    private Integer consultationFee;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getSpecialty() {
        return specialty;
    }

    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }

    public Integer getExperience() {
        return experience;
    }

    public void setExperience(Integer experience) {
        this.experience = experience;
    }
    
    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    
    public Integer getConsultationFee() { return consultationFee; }
    public void setConsultationFee(Integer consultationFee) { this.consultationFee = consultationFee; }
}
