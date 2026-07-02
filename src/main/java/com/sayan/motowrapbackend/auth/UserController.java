package com.sayan.motowrapbackend.auth;

import com.sayan.motowrapbackend.bike.BikeRepository;
import com.sayan.motowrapbackend.exception.UserNotFoundException;
import com.sayan.motowrapbackend.ride.Ride;
import com.sayan.motowrapbackend.ride.GpsPointRepository;
import com.sayan.motowrapbackend.ride.RideRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private GpsPointRepository gpsPointRepository;

    @Autowired
    private BikeRepository bikeRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName());
        if (user == null) throw new UserNotFoundException("User not found");

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "name", user.getName(),
                "createdAt", user.getCreatedAt()
        ));
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(Authentication authentication,
                                           @RequestBody UpdateProfileRequest request) {
        User user = userRepository.findByEmail(authentication.getName());
        if (user == null) throw new UserNotFoundException("User not found");

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName().trim());
        }

        // Password change — only if both fields are provided
        if (request.getCurrentPassword() != null && request.getNewPassword() != null) {
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Current password is incorrect"));
            }
            if (request.getNewPassword().length() < 6) {
                return ResponseEntity.badRequest().body(Map.of("error", "New password must be at least 6 characters"));
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "name", user.getName()
        ));
    }

    @DeleteMapping("/me")
    @Transactional
    public ResponseEntity<?> deleteAccount(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName());
        if (user == null) throw new UserNotFoundException("User not found");

        // No JPA cascades are configured, so delete children first:
        // gps points -> rides -> bikes -> user
        List<Ride> rides = rideRepository.findByUserOrderByStartTimeDesc(user);
        for (Ride ride : rides) {
            gpsPointRepository.deleteByRide(ride);
        }
        rideRepository.deleteAll(rides);
        bikeRepository.deleteAll(bikeRepository.findByUserOrderByIsDefaultDescCreatedAtDesc(user));
        userRepository.delete(user);

        return ResponseEntity.ok(Map.of("message", "Account and all associated data deleted"));
    }

    public static class UpdateProfileRequest {
        public String name;
        public String currentPassword;
        public String newPassword;

        public String getName() { return name; }
        public String getCurrentPassword() { return currentPassword; }
        public String getNewPassword() { return newPassword; }
    }
}
