package com.sayan.motowrapbackend.bike;

import com.sayan.motowrapbackend.auth.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bikes")
public class BikeController {

    @Autowired
    private BikeService bikeService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<BikeDTO>> getBikes(Authentication authentication) {
        Long userId = getUserId(authentication);
        return ResponseEntity.ok(bikeService.getUserBikes(userId));
    }

    @PostMapping
    public ResponseEntity<BikeDTO> createBike(Authentication authentication,
                                              @RequestBody BikeRequest request) {
        Long userId = getUserId(authentication);
        return ResponseEntity.ok(bikeService.createBike(userId, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BikeDTO> updateBike(Authentication authentication,
                                              @PathVariable Long id,
                                              @RequestBody BikeRequest request) {
        Long userId = getUserId(authentication);
        return ResponseEntity.ok(bikeService.updateBike(userId, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBike(Authentication authentication,
                                        @PathVariable Long id) {
        Long userId = getUserId(authentication);
        bikeService.deleteBike(userId, id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/default")
    public ResponseEntity<BikeDTO> setDefault(Authentication authentication,
                                              @PathVariable Long id) {
        Long userId = getUserId(authentication);
        return ResponseEntity.ok(bikeService.setDefault(userId, id));
    }

    private Long getUserId(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName()).getId();
    }
}
