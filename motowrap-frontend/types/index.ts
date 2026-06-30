export interface User {
  userId: number;
  email: string;
  name: string;
}

export interface AuthResponse extends User {
  token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Ride {
  id: number;
  startTime: string;
  endTime: string | null;
  distanceKm: number;
  durationSeconds: number;
  averageSpeed: number;
  maxSpeed: number;
  status: string;
}

export interface UserRideStats {
  totalRides: number;
  totalDistanceKm: number;
  totalDurationSeconds: number;
  overallAvgSpeed: number;
  overallMaxSpeed: number;
}

export interface RidePoint {
  latitude: number;
  longitude: number;
  altitude: number | null;
  timestamp: string;
}

export interface RideDetail extends Ride {
  route: RidePoint[];
}

export interface StartRideResponse {
  rideId: number;
  status: string;
  startTime: string;
}

export interface EndRideResponse {
  rideId: number;
  status: string;
  distanceKm: number;
  durationSeconds: number;
  averageSpeed: number;
  maxSpeed: number;
  endTime: string;
}

export interface GpsPointRequest {
  latitude: number;
  longitude: number;
  altitude?: number | null;
  accuracy?: number | null;
}
