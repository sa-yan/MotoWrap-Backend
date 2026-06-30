package com.sayan.motowrapbackend.ride;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.sayan.motowrapbackend.auth.UserRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rides")
public class RideController {
    @Autowired
    private RideService rideService;

    @Autowired
    private UserRepository userRepository;

    // Start a new ride
    @PostMapping("/start")
    public ResponseEntity<?> startRide(Authentication authentication) {
        Long userId = userRepository.findByEmail(authentication.getName()).getId();
        Ride ride = rideService.startRide(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("rideId", ride.getId());
        response.put("status", "Ride started");
        response.put("startTime", ride.getStartTime());

        return ResponseEntity.ok(response);
    }

    // End the active ride
    @PostMapping("/end")
    public ResponseEntity<?> endRide(Authentication authentication) {
        Long userId = userRepository.findByEmail(authentication.getName()).getId();
        Ride ride = rideService.endRide(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("rideId", ride.getId());
        response.put("status", "Ride completed");
        response.put("distanceKm", ride.getDistanceKm());
        response.put("durationSeconds", ride.getDurationSeconds());
        response.put("averageSpeed", ride.getAverageSpeed());
        response.put("endTime", ride.getEndTime());

        return ResponseEntity.ok(response);
    }

    // Add GPS point to active ride
    @PostMapping("/gps")
    public ResponseEntity<?> addGpsPoint(Authentication authentication,
                                         @RequestBody GpsPointRequest request) {
        Long userId = userRepository.findByEmail(authentication.getName()).getId();
        GpsPoint point = rideService.addGpsPoint(userId, request.getLatitude(),
                request.getLongitude(),
                request.getAltitude(),
                request.getAccuracy());

        Map<String, Object> response = new HashMap<>();
        response.put("pointId", point.getId());
        response.put("timestamp", point.getTimestamp());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/gps/batch")
    public ResponseEntity<?> addGpsPointsBatch(Authentication authentication,
                                               @RequestBody List<GpsPointRequest> points) {
        Long userId = userRepository.findByEmail(authentication.getName()).getId();
        int saved = 0;
        for (GpsPointRequest point : points) {
            try {
                rideService.addGpsPoint(
                        userId,
                        point.getLatitude(),
                        point.getLongitude(),
                        point.getAltitude(),
                        point.getAccuracy()
                );
                saved++;
            } catch (Exception e) {
                System.out.println("Skipping bad GPS point: " + e.getMessage());
            }
        }
        Map<String, Object> response = new HashMap<>();
        response.put("saved", saved);
        response.put("total", points.size());
        return ResponseEntity.ok(response);
    }

    // Get lifetime stats for the authenticated user
    @GetMapping("/stats")
    public ResponseEntity<?> getUserStats(Authentication authentication) {
        Long userId = userRepository.findByEmail(authentication.getName()).getId();
        return ResponseEntity.ok(rideService.getUserStats(userId));
    }

    // Get the current active ride (used by frontend on app resume)
    @GetMapping("/active")
    public ResponseEntity<?> getActiveRide(Authentication authentication) {
        Long userId = userRepository.findByEmail(authentication.getName()).getId();
        return rideService.getActiveRide(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get all rides for user
    @GetMapping
    public ResponseEntity<?> getRides(Authentication authentication) {
        Long userId = userRepository.findByEmail(authentication.getName()).getId();
        List<RideDTO> rides = rideService.getUserRides(userId);
        return ResponseEntity.ok(rides);
    }

    // Get single ride with route for map display
    @GetMapping("/{rideId}")
    public ResponseEntity<?> getRideDetail(Authentication authentication,
                                           @PathVariable Long rideId) {
        Long userId = userRepository.findByEmail(authentication.getName()).getId();
        RideDetailDTO rideDetail = rideService.getRideDetail(rideId, userId);
        return ResponseEntity.ok(rideDetail);
    }

    // Request DTO for GPS points
    public static class GpsPointRequest {
        public Double latitude;
        public Double longitude;
        public Double altitude;
        public Double accuracy;

        public Double getLatitude() { return latitude; }
        public Double getLongitude() { return longitude; }
        public Double getAltitude() { return altitude; }
        public Double getAccuracy() { return accuracy; }
    }
}

