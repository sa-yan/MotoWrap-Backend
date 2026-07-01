package com.sayan.motowrapbackend.bike;

import com.sayan.motowrapbackend.auth.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bikes")
public class Bike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String nickname; // user-defined name e.g. "My Duke"

    @Column
    private String make; // brand e.g. "KTM"

    @Column
    private String model; // model e.g. "Duke 390"

    @Column
    private Integer year;

    @Column(name = "engine_cc")
    private Integer engineCC;

    @Column
    private String color;

    @Column(name = "license_plate")
    private String licensePlate;

    @Column(name = "is_default", nullable = false)
    private Boolean isDefault = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
