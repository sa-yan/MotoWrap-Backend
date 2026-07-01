package com.sayan.motowrapbackend.bike;

import com.sayan.motowrapbackend.auth.User;
import com.sayan.motowrapbackend.auth.UserRepository;
import com.sayan.motowrapbackend.exception.BikeNotFoundException;
import com.sayan.motowrapbackend.exception.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BikeService {

    @Autowired
    private BikeRepository bikeRepository;

    @Autowired
    private UserRepository userRepository;

    public List<BikeDTO> getUserBikes(Long userId) {
        User user = getUser(userId);
        return bikeRepository.findByUserOrderByIsDefaultDescCreatedAtDesc(user)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public BikeDTO createBike(Long userId, BikeRequest request) {
        User user = getUser(userId);
        Bike bike = new Bike();
        bike.setUser(user);
        applyRequest(bike, request);

        // First bike is automatically the default
        boolean hasAny = !bikeRepository.findByUserOrderByIsDefaultDescCreatedAtDesc(user).isEmpty();
        bike.setIsDefault(!hasAny);

        return toDTO(bikeRepository.save(bike));
    }

    public BikeDTO updateBike(Long userId, Long bikeId, BikeRequest request) {
        User user = getUser(userId);
        Bike bike = bikeRepository.findByIdAndUser(bikeId, user)
                .orElseThrow(() -> new BikeNotFoundException("Bike not found"));
        applyRequest(bike, request);
        return toDTO(bikeRepository.save(bike));
    }

    public void deleteBike(Long userId, Long bikeId) {
        User user = getUser(userId);
        Bike bike = bikeRepository.findByIdAndUser(bikeId, user)
                .orElseThrow(() -> new BikeNotFoundException("Bike not found"));
        boolean wasDefault = Boolean.TRUE.equals(bike.getIsDefault());
        bikeRepository.delete(bike);

        // If deleted bike was default, promote the next bike
        if (wasDefault) {
            bikeRepository.findByUserOrderByIsDefaultDescCreatedAtDesc(user)
                    .stream().findFirst().ifPresent(next -> {
                        next.setIsDefault(true);
                        bikeRepository.save(next);
                    });
        }
    }

    @Transactional
    public BikeDTO setDefault(Long userId, Long bikeId) {
        User user = getUser(userId);
        Bike bike = bikeRepository.findByIdAndUser(bikeId, user)
                .orElseThrow(() -> new BikeNotFoundException("Bike not found"));

        // Clear current default
        bikeRepository.findByUserAndIsDefaultTrue(user).ifPresent(current -> {
            if (!current.getId().equals(bikeId)) {
                current.setIsDefault(false);
                bikeRepository.save(current);
            }
        });

        bike.setIsDefault(true);
        return toDTO(bikeRepository.save(bike));
    }

    private void applyRequest(Bike bike, BikeRequest r) {
        if (r.getNickname() != null && !r.getNickname().isBlank())
            bike.setNickname(r.getNickname().trim());
        if (r.getMake() != null) bike.setMake(r.getMake().trim());
        if (r.getModel() != null) bike.setModel(r.getModel().trim());
        if (r.getYear() != null) bike.setYear(r.getYear());
        if (r.getEngineCC() != null) bike.setEngineCC(r.getEngineCC());
        if (r.getColor() != null) bike.setColor(r.getColor().trim());
        if (r.getLicensePlate() != null) bike.setLicensePlate(r.getLicensePlate().trim());
    }

    private BikeDTO toDTO(Bike b) {
        BikeDTO dto = new BikeDTO();
        dto.setId(b.getId());
        dto.setNickname(b.getNickname());
        dto.setMake(b.getMake());
        dto.setModel(b.getModel());
        dto.setYear(b.getYear());
        dto.setEngineCC(b.getEngineCC());
        dto.setColor(b.getColor());
        dto.setLicensePlate(b.getLicensePlate());
        dto.setIsDefault(b.getIsDefault());
        dto.setCreatedAt(b.getCreatedAt());
        return dto;
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
    }
}
