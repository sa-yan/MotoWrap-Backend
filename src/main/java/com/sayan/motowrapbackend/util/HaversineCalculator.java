package com.sayan.motowrapbackend.util;

public class HaversineCalculator {
    private static final double EARTH_RADIUS_KM = 6371.0;

    public static double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_KM * c;
    }

    public static double calculateTotalDistance(double[] latitudes, double[] longitudes) {
        if (latitudes.length < 2) return 0.0;

        double totalDistance = 0.0;
        for (int i = 0; i < latitudes.length - 1; i++) {
            totalDistance += calculateDistance(latitudes[i], longitudes[i],
                    latitudes[i + 1], longitudes[i + 1]);
        }
        return totalDistance;
    }
}