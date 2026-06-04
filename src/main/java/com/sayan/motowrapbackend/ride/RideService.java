package com.sayan.motowrapbackend.ride;

import com.sayan.motowrapbackend.auth.User;
import com.sayan.motowrapbackend.auth.UserRepository;
import com.sayan.motowrapbackend.util.HaversineCalculator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RideService {
    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private GpsPointRepository gpsPointRepository;

    @Autowired
    private UserRepository userRepository;

    // Start a new ride
    public Ride startRide(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Ride ride = new Ride();
        ride.setUser(user);
        ride.setStartTime(LocalDateTime.now());
        ride.setStatus("active");
        return rideRepository.save(ride);
    }

    // End the active ride and calculate stats
    public Ride endRide(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Ride ride = rideRepository.findByUserAndStatus(user, "active")
                .orElseThrow(() -> new RuntimeException("No active ride found"));

        ride.setEndTime(LocalDateTime.now());
        ride.setStatus("completed");

        // Calculate duration in seconds
        long duration = ChronoUnit.SECONDS.between(ride.getStartTime(), ride.getEndTime());
        ride.setDurationSeconds(duration);

        // Get all GPS points and calculate distance
        List<GpsPoint> points = gpsPointRepository.findByRideOrderByTimestampAsc(ride);
        if (points.size() >= 2) {
            double totalDistance = calculateDistanceFromPoints(points);
            ride.setDistanceKm(totalDistance);

            // Calculate average speed (km/h)
            double durationHours = duration / 3600.0;
            if (durationHours > 0) {
                double avgSpeed = totalDistance / durationHours;
                ride.setAverageSpeed(avgSpeed);
            }
        }

        return rideRepository.save(ride);
    }

    // Add GPS point to active ride
    public GpsPoint addGpsPoint(Long userId, double latitude, double longitude,
                                double altitude, double accuracy) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Ride ride = rideRepository.findByUserAndStatus(user, "active")
                .orElseThrow(() -> new RuntimeException("No active ride found"));

        GpsPoint point = new GpsPoint();
        point.setRide(ride);
        point.setLatitude(latitude);
        point.setLongitude(longitude);
        point.setAltitude(altitude);
        point.setAccuracy(accuracy);
        point.setTimestamp(LocalDateTime.now());

        return gpsPointRepository.save(point);
    }

    // Get all rides for a user
    public List<RideDTO> getUserRides(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return rideRepository.findByUserOrderByStartTimeDesc(user)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get single ride with all GPS points for map
    public RideDetailDTO getRideDetail(Long rideId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Ride ride = rideRepository.findByIdAndUser(rideId, user)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        List<GpsPoint> points = gpsPointRepository.findByRideOrderByTimestampAsc(ride);

        RideDetailDTO dto = new RideDetailDTO();
        dto.setId(ride.getId());
        dto.setStartTime(ride.getStartTime());
        dto.setEndTime(ride.getEndTime());
        dto.setDistanceKm(ride.getDistanceKm());
        dto.setDurationSeconds(ride.getDurationSeconds());
        dto.setAverageSpeed(ride.getAverageSpeed());
        dto.setStatus(ride.getStatus());
        dto.setRoute(points.stream()
                .map(p -> new GpsPointDTO(p.getLatitude(), p.getLongitude(), p.getAltitude(), p.getTimestamp()))
                .collect(Collectors.toList()));
        System.out.println("GPS points found: " + points.size());
        System.out.println("First point: " + (points.isEmpty() ? "none" : points.get(0).getLatitude() + ", " + points.get(0).getLongitude()));
        return dto;
    }

    // Helper: Calculate total distance from GPS points
    private double calculateDistanceFromPoints(List<GpsPoint> points) {
        double totalDistance = 0.0;
        for (int i = 0; i < points.size() - 1; i++) {
            GpsPoint current = points.get(i);
            GpsPoint next = points.get(i + 1);
            totalDistance += HaversineCalculator.calculateDistance(
                    current.getLatitude(), current.getLongitude(),
                    next.getLatitude(), next.getLongitude()
            );
        }
        return totalDistance;
    }

    // Helper: Convert Ride to DTO
    private RideDTO convertToDTO(Ride ride) {
        RideDTO dto = new RideDTO();
        dto.setId(ride.getId());
        dto.setStartTime(ride.getStartTime());
        dto.setEndTime(ride.getEndTime());
        dto.setDistanceKm(ride.getDistanceKm());
        dto.setDurationSeconds(ride.getDurationSeconds());
        dto.setAverageSpeed(ride.getAverageSpeed());
        dto.setStatus(ride.getStatus());
        return dto;
    }
}
