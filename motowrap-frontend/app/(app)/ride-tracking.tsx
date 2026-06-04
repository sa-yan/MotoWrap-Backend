import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Snackbar, Text } from 'react-native-paper';
import { RideMap } from '@/components/rides/RideMap';
import { RideStats } from '@/components/rides/RideStats';
import { Button } from '@/components/common/Button';
import { useLocationTracking } from '@/hooks/useLocation';
import { useRideActions } from '@/hooks/useRides';
import { GPS_SUBMISSION_INTERVAL_MS } from '@/utils/constants';
import { getErrorMessage } from '@/utils/errors';

const toRad = (deg: number) => (deg * Math.PI) / 180;
const segmentDistance = (a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) => {
  const earth = 6371;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const y = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return earth * y;
};

export default function RideTrackingScreen() {
  const [activeRideId, setActiveRideId] = useState<number | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState<string | null>(null);
  const lastSubmitRef = useRef<number>(0);

  const { start, end, pushGps } = useRideActions();
  const pushGpsPoint = pushGps.mutate;
  const { permissionGranted, currentPoint, route, resetRoute } = useLocationTracking(Boolean(activeRideId));

  useEffect(() => {
    if (!activeRideId || !currentPoint) {
      return;
    }

    const now = Date.now();
    if (now - lastSubmitRef.current < GPS_SUBMISSION_INTERVAL_MS) {
      return;
    }

    lastSubmitRef.current = now;
    pushGpsPoint({
      latitude: currentPoint.latitude,
      longitude: currentPoint.longitude,
      altitude: currentPoint.altitude,
      accuracy: currentPoint.accuracy,
    });
  }, [activeRideId, currentPoint, pushGpsPoint]);

  const distanceKm = useMemo(() => {
    if (route.length < 2) return 0;
    return route.slice(1).reduce((sum, point, idx) => sum + segmentDistance(route[idx], point), 0);
  }, [route]);

  const durationSeconds = startedAt ? Math.max(0, Math.floor((Date.now() - startedAt) / 1000)) : 0;
  const averageSpeed = durationSeconds > 0 ? distanceKm / (durationSeconds / 3600) : 0;

  const onStartRide = async () => {
    try {
      const data = await start.mutateAsync();
      setActiveRideId(data.rideId);
      setStartedAt(Date.now());
      resetRoute();
      setSnackbar('Ride started');
    } catch (error) {
      setSnackbar(getErrorMessage(error, 'Failed to start ride'));
    }
  };

  const onEndRide = async () => {
    try {
      await end.mutateAsync();
      setActiveRideId(null);
      setStartedAt(null);
      setSnackbar('Ride ended');
    } catch (error) {
      setSnackbar(getErrorMessage(error, 'Failed to end ride'));
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Text variant="titleMedium">Permission: {permissionGranted ? 'Granted' : 'Not granted'}</Text>
      <RideMap points={route} />
      <RideStats distanceKm={distanceKm} durationSeconds={durationSeconds} averageSpeed={averageSpeed} />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Button disabled={Boolean(activeRideId)} loading={start.isPending} onPress={onStartRide} style={{ flex: 1 }}>
          Start
        </Button>
        <Button disabled={!activeRideId} loading={end.isPending} onPress={onEndRide} style={{ flex: 1 }}>
          End
        </Button>
      </View>
      <Snackbar visible={Boolean(snackbar)} onDismiss={() => setSnackbar(null)}>
        {snackbar}
      </Snackbar>
    </ScrollView>
  );
}
