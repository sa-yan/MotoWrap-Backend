import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addGpsPoint, endRide, getRideDetail, getRides, startRide } from '@/api/rides';

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
    },
  });

  const end = useMutation({
    mutationFn: endRide,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rides'] });
    },
  });

  const pushGps = useMutation({
    mutationFn: addGpsPoint,
  });

  return { start, end, pushGps };
};
