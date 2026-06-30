import { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Snackbar, Text, Card } from 'react-native-paper';
import { RideMap } from '@/components/rides/RideMap';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';
import { useLocationTracking } from '@/hooks/useLocation';
import { useActiveRide, useRideActions } from '@/hooks/useRides';
import { GPS_SUBMISSION_INTERVAL_MS } from '@/utils/constants';
import { getErrorMessage } from '@/utils/errors';

const toRad = (deg: number) => (deg * Math.PI) / 180;

const segmentDistance = (
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number },
) => {
  const earth = 6371;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return earth * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
};

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statBox}>
      <Text variant="headlineSmall" style={styles.statValue}>{value}</Text>
      <Text variant="bodySmall" style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function RideTrackingScreen() {
  const [activeRideId, setActiveRideId] = useState<number | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [snackbar, setSnackbar] = useState<string | null>(null);
  const lastSubmitRef = useRef<number>(0);

  const { data: activeRide, isLoading: checkingActiveRide } = useActiveRide();
  const { start, end, pushGps } = useRideActions();
  const pushGpsPoint = pushGps.mutate;

  // Restore active ride on mount (e.g. app was backgrounded mid-ride)
  useEffect(() => {
    if (activeRide && !activeRideId) {
      setActiveRideId(activeRide.id);
      setStartedAt(new Date(activeRide.startTime).getTime());
    }
  }, [activeRide]);

  // Live timer — ticks every second while a ride is active
  useEffect(() => {
    if (!activeRideId) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [activeRideId]);

  const { permissionGranted, currentPoint, route, resetRoute } = useLocationTracking(
    Boolean(activeRideId),
  );

  // Submit GPS point to backend on interval
  useEffect(() => {
    if (!activeRideId || !currentPoint) return;
    const timestamp = Date.now();
    if (timestamp - lastSubmitRef.current < GPS_SUBMISSION_INTERVAL_MS) return;
    lastSubmitRef.current = timestamp;
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

  const durationSeconds = startedAt ? Math.max(0, Math.floor((now - startedAt) / 1000)) : 0;
  const averageSpeed = durationSeconds > 0 ? distanceKm / (durationSeconds / 3600) : 0;

  const onStartRide = async () => {
    try {
      const data = await start.mutateAsync();
      setActiveRideId(data.rideId);
      setStartedAt(Date.now());
      setNow(Date.now());
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

  if (checkingActiveRide) return <Loading />;

  return (
    <View style={styles.container}>
      {/* Map fills all available space */}
      <View style={styles.mapContainer}>
        <RideMap points={route} />
        {/* Status badge overlaid on top of the map */}
        <View style={styles.statusBadge}>
          <Text variant="bodySmall" style={{ color: activeRideId ? '#fff' : '#ccc' }}>
            {activeRideId ? '● Recording' : '○ Not recording'}
          </Text>
        </View>
      </View>

      {/* Dashboard panel always visible below the map */}
      <View style={styles.panel}>
        <Card style={styles.statsCard}>
          <Card.Content style={styles.statsRow}>
            <StatBox label="Distance" value={`${distanceKm.toFixed(2)} km`} />
            <View style={styles.divider} />
            <StatBox label="Duration" value={formatDuration(durationSeconds)} />
            <View style={styles.divider} />
            <StatBox label="Avg Speed" value={`${averageSpeed.toFixed(1)} km/h`} />
          </Card.Content>
        </Card>

        <View style={styles.buttons}>
          <Button
            disabled={Boolean(activeRideId)}
            loading={start.isPending}
            onPress={onStartRide}
            style={styles.button}
          >
            Start
          </Button>
          <Button
            disabled={!activeRideId}
            loading={end.isPending}
            onPress={onEndRide}
            mode="outlined"
            style={styles.button}
          >
            End
          </Button>
        </View>

        <Text variant="bodySmall" style={styles.gpsStatus}>
          {permissionGranted
            ? `GPS active · ${route.length} points recorded`
            : 'Location permission not granted'}
        </Text>
      </View>

      <Snackbar visible={Boolean(snackbar)} onDismiss={() => setSnackbar(null)}>
        {snackbar}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  panel: {
    padding: 16,
    gap: 12,
    backgroundColor: '#fff',
  },
  statsCard: {
    elevation: 0,
    backgroundColor: '#f8f8f8',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  statLabel: {
    color: '#888',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#e0e0e0',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
  gpsStatus: {
    textAlign: 'center',
    color: '#aaa',
  },
});
