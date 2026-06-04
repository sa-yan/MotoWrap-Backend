package com.sayan.motowrapbackend.ride;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RideDTO {
    private Long id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Double distanceKm;
    private Long durationSeconds;
    private Double averageSpeed;
    private String status;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class RideDetailDTO {
    private Long id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Double distanceKm;
    private Long durationSeconds;
    private Double averageSpeed;
    private String status;
    private List<GpsPointDTO> route;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class GpsPointDTO {
    private Double latitude;
    private Double longitude;
    private Double altitude;
    private LocalDateTime timestamp;
}

