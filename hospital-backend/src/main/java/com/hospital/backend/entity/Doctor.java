package com.hospital.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    private String name;
    private String specialty;
    private Integer experience; // in years
    private String phone;
    private Integer consultationFee;

    public Doctor() {
    }

    public Doctor(User user, String name, String specialty, Integer experience, String phone, Integer consultationFee) {
        this.user = user;
        this.name = name;
        this.specialty = specialty;
        this.experience = experience;
        this.phone = phone;
        this.consultationFee = consultationFee;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSpecialty() { return specialty; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }

    public Integer getExperience() { return experience; }
    public void setExperience(Integer experience) { this.experience = experience; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Integer getConsultationFee() { return consultationFee; }
    public void setConsultationFee(Integer consultationFee) { this.consultationFee = consultationFee; }
}
