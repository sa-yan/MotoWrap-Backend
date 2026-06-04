package com.sayan.motowrapbackend.ride;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GpsPointRepository extends JpaRepository<GpsPoint, Long> {
    List<GpsPoint> findByRideOrderByTimestampAsc(Ride ride);
}
