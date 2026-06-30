import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addGpsPoint, endRide, getActiveRide, getRideDetail, getRides, getUserStats, startRide } from '@/api/rides';

export const useActiveRide = () =>
  useQuery({
    queryKey: ['rides', 'active'],
    queryFn: getActiveRide,
  });

export const useRideStats = () =>
  useQuery({
    queryKey: ['rides', 'stats'],
    queryFn: getUserStats,
  });

export const useRideHistory = () =>
  useQuery({
    queryKey: ['rides'],
    queryFn: getRides,
  });

export const useRideDetail = (rideId?: number) =>
  useQuery({
    queryKey: ['ride', rideId],
    queryFn: () => getRideDetail(rideId as number),
    enabled: typeof rideId === 'number',
  });

export const useRideActions = () => {
  const queryClient = useQueryClient();

  const start = useMutation({
    mutationFn: startRide,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rides'] });
      queryClient.invalidateQueries({ queryKey: ['rides', 'active'] });
    },
  });

  const end = useMutation({
    mutationFn: endRide,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rides'] });
      queryClient.invalidateQueries({ queryKey: ['rides', 'active'] });
      queryClient.invalidateQueries({ queryKey: ['rides', 'stats'] });
    },
  });

  const pushGps = useMutation({
    mutationFn: addGpsPoint,
  });

  return { start, end, pushGps };
};
