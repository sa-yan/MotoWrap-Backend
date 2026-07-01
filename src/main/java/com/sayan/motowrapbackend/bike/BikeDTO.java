package com.sayan.motowrapbackend.bike;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BikeDTO {
    private Long id;
    private String nickname;
    private String make;
    private String model;
    private Integer year;
    private Integer engineCC;
    private String color;
    private String licensePlate;
    private Boolean isDefault;
    private LocalDateTime createdAt;
}
