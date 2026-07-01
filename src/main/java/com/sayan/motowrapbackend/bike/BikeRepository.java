package com.sayan.motowrapbackend.bike;

import com.sayan.motowrapbackend.auth.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BikeRepository extends JpaRepository<Bike, Long> {
    List<Bike> findByUserOrderByIsDefaultDescCreatedAtDesc(User user);
    Optional<Bike> findByIdAndUser(Long id, User user);
    Optional<Bike> findByUserAndIsDefaultTrue(User user);
}
