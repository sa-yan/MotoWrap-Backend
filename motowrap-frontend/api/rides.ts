import { apiClient } from '@/api/client';
import type { EndRideResponse, GpsPointRequest, Ride, RideDetail, StartRideResponse } from '@/types';

export const startRide = async (): Promise<StartRideResponse> => {
  const { data } = await apiClient.post<StartRideResponse>('/api/rides/start');
  return data;
};

export const endRide = async (): Promise<EndRideResponse> => {
  const { data } = await apiClient.post<EndRideResponse>('/api/rides/end');
  return data;
};

export const addGpsPoint = async (payload: GpsPointRequest): Promise<{ pointId: number; timestamp: string }> => {
  const { data } = await apiClient.post<{ pointId: number; timestamp: string }>('/api/rides/gps', payload);
  return data;
};

export const getRides = async (): Promise<Ride[]> => {
  const { data } = await apiClient.get<Ride[]>('/api/rides');
  return data;
};

export const getRideDetail = async (rideId: number): Promise<RideDetail> => {
  const { data } = await apiClient.get<RideDetail>(`/api/rides/${rideId}`);
  return data;
};
