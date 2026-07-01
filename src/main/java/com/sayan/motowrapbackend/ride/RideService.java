package com.sayan.motowrapbackend.ride;

import com.sayan.motowrapbackend.auth.User;
import com.sayan.motowrapbackend.auth.UserRepository;
import com.sayan.motowrapbackend.exception.ActiveRideConflictException;
import com.sayan.motowrapbackend.exception.RideNotFoundException;
import com.sayan.motowrapbackend.exception.UserNotFoundException;
import com.sayan.motowrapbackend.util.HaversineCalculator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class RideService {
    private static final double MAX_ACCURACY_METERS = 25.0;
    private static final double MAX_SPEED_KMH = 250.0;
    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private GpsPointRepository gpsPointRepository;

    @Autowired
    private UserRepository userRepository;

    // Start a new ride
    public Ride startRide(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        rideRepository.findByUserAndStatus(user, "active").ifPresent(r -> {
            throw new ActiveRideConflictException("You already have an active ride. End it before starting a new one.");
        });

        Ride ride = new Ride();
        ride.setUser(user);
        ride.setStartTime(LocalDateTime.now());
        ride.setStatus("active");
        return rideRepository.save(ride);
    }

    // Get the current active ride (for app resume)
    public Optional<RideDTO> getActiveRide(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        return rideRepository.findByUserAndStatus(user, "active")
                .map(this::convertToDTO);
    }

    // End the active ride and calculate stats
    public Ride endRide(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Ride ride = rideRepository.findByUserAndStatus(user, "active")
                .orElseThrow(() -> new RideNotFoundException("No active ride found"));

        ride.setEndTime(LocalDateTime.now());
        ride.setStatus("completed");

        // Calculate duration in seconds
        long duration = ChronoUnit.SECONDS.between(ride.getStartTime(), ride.getEndTime());
        ride.setDurationSeconds(duration);

        // Get all GPS points, filter low-accuracy fixes, then calculate stats
        List<GpsPoint> allPoints = gpsPointRepository.findByRideOrderByTimestampAsc(ride);
        List<GpsPoint> points = filterByAccuracy(allPoints);
        if (points.size() >= 2) {
            double totalDistance = calculateDistanceFromPoints(points);
            ride.setDistanceKm(totalDistance);

            double durationHours = duration / 3600.0;
            if (durationHours > 0) {
                ride.setAverageSpeed(totalDistance / durationHours);
            }

            ride.setMaxSpeed(calculateMaxSpeed(points));
        }

        return rideRepository.save(ride);
    }

    // Add GPS point to active ride
    public GpsPoint addGpsPoint(Long userId, double latitude, double longitude,
                                Double altitude, Double accuracy, Double speed) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Ride ride = rideRepository.findByUserAndStatus(user, "active")
                .orElseThrow(() -> new RideNotFoundException("No active ride found"));

        GpsPoint point = new GpsPoint();
        point.setRide(ride);
        point.setLatitude(latitude);
        point.setLongitude(longitude);
        point.setAltitude(altitude);
        point.setAccuracy(accuracy);
        point.setSpeed(speed);
        point.setTimestamp(LocalDateTime.now());

        return gpsPointRepository.save(point);
    }

    // Get all rides for a user
    public List<RideDTO> getUserRides(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        return rideRepository.findByUserOrderByStartTimeDesc(user)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get single ride with all GPS points for map
    public RideDetailDTO getRideDetail(Long rideId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Ride ride = rideRepository.findByIdAndUser(rideId, user)
                .orElseThrow(() -> new RideNotFoundException("Ride not found or does not belong to you"));

        List<GpsPoint> points = gpsPointRepository.findByRideOrderByTimestampAsc(ride);

        RideDetailDTO dto = new RideDetailDTO();
        dto.setId(ride.getId());
        dto.setStartTime(ride.getStartTime());
        dto.setEndTime(ride.getEndTime());
        dto.setDistanceKm(ride.getDistanceKm());
        dto.setDurationSeconds(ride.getDurationSeconds());
        dto.setAverageSpeed(ride.getAverageSpeed());
        dto.setMaxSpeed(ride.getMaxSpeed());
        dto.setStatus(ride.getStatus());
        dto.setRoute(points.stream()
                .map(p -> new GpsPointDTO(p.getLatitude(), p.getLongitude(), p.getAltitude(), p.getTimestamp()))
                .collect(Collectors.toList()));
        System.out.println("GPS points found: " + points.size());
        System.out.println("First point: " + (points.isEmpty() ? "none" : points.get(0).getLatitude() + ", " + points.get(0).getLongitude()));
        return dto;
    }

    // Delete a ride and its GPS points
    public void deleteRide(Long rideId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Ride ride = rideRepository.findByIdAndUser(rideId, user)
                .orElseThrow(() -> new RideNotFoundException("Ride not found or does not belong to you"));

        gpsPointRepository.deleteByRide(ride);
        rideRepository.delete(ride);
    }

    // Get lifetime stats for a user
    public RideStatsDTO getUserStats(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        List<Ride> completed = rideRepository.findByUserOrderByStartTimeDesc(user)
                .stream()
                .filter(r -> "completed".equals(r.getStatus()))
                .collect(Collectors.toList());

        long totalRides = completed.size();
        double totalDistance = completed.stream().mapToDouble(r -> r.getDistanceKm() != null ? r.getDistanceKm() : 0).sum();
        long totalDuration = completed.stream().mapToLong(r -> r.getDurationSeconds() != null ? r.getDurationSeconds() : 0).sum();
        double maxSpeed = completed.stream().mapToDouble(r -> r.getMaxSpeed() != null ? r.getMaxSpeed() : 0).max().orElse(0);
        double avgSpeed = totalDuration > 0 ? totalDistance / (totalDuration / 3600.0) : 0;

        return new RideStatsDTO(totalRides, totalDistance, totalDuration, avgSpeed, maxSpeed);
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

    // Helper: Keep only points with accuracy <= MAX_ACCURACY_METERS
    private List<GpsPoint> filterByAccuracy(List<GpsPoint> points) {
        return points.stream()
                .filter(p -> p.getAccuracy() != null && p.getAccuracy() <= MAX_ACCURACY_METERS)
                .collect(Collectors.toList());
    }

    // Helper: Calculate max speed (km/h).
    // Prefers chipset-reported speed per point (more accurate, especially at low speeds).
    // Falls back to haversine segment speed for points that have no chipset speed.
    private double calculateMaxSpeed(List<GpsPoint> points) {
        // If most points have chipset speed, use MAX(speed) directly
        long withChipsetSpeed = points.stream()
                .filter(p -> p.getSpeed() != null && p.getSpeed() > 0 && p.getSpeed() <= MAX_SPEED_KMH)
                .count();

        if (withChipsetSpeed > points.size() / 2) {
            return points.stream()
                    .filter(p -> p.getSpeed() != null && p.getSpeed() <= MAX_SPEED_KMH)
                    .mapToDouble(GpsPoint::getSpeed)
                    .max()
                    .orElse(0);
        }

        // Fallback: haversine segment speed with spike filter
        return IntStream.range(0, points.size() - 1)
                .mapToDouble(i -> {
                    GpsPoint a = points.get(i);
                    GpsPoint b = points.get(i + 1);
                    double distKm = HaversineCalculator.calculateDistance(
                            a.getLatitude(), a.getLongitude(),
                            b.getLatitude(), b.getLongitude());
                    double timeHours = ChronoUnit.SECONDS.between(a.getTimestamp(), b.getTimestamp()) / 3600.0;
                    if (timeHours <= 0) return 0;
                    double speedKmh = distKm / timeHours;
                    return speedKmh <= MAX_SPEED_KMH ? speedKmh : 0;
                })
                .max()
                .orElse(0);
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
        dto.setMaxSpeed(ride.getMaxSpeed());
        dto.setStatus(ride.getStatus());
        return dto;
    }
}
