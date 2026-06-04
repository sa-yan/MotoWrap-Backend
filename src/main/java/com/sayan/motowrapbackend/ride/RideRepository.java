package com.sayan.motowrapbackend.ride;

import com.sayan.motowrapbackend.auth.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByUserOrderByStartTimeDesc(User user);
    Optional<Ride> findByIdAndUser(Long id, User user);
    Optional<Ride> findByUserAndStatus(User user, String status);
}
