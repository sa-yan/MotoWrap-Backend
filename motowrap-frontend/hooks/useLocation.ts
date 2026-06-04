import { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { GPS_WATCH_INTERVAL_MS } from '@/utils/constants';

type LocationPoint = {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number | null;
};

export function useLocationTracking(enabled: boolean) {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [currentPoint, setCurrentPoint] = useState<LocationPoint | null>(null);
  const [route, setRoute] = useState<LocationPoint[]>([]);
  const watcherRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionGranted(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    if (!enabled || !permissionGranted) {
      watcherRef.current?.remove();
      watcherRef.current = null;
      return;
    }

    (async () => {
      watcherRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: GPS_WATCH_INTERVAL_MS,
          distanceInterval: 5,
        },
        (location) => {
          const point: LocationPoint = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            altitude: location.coords.altitude,
            accuracy: location.coords.accuracy,
          };
          setCurrentPoint(point);
          setRoute((prev) => [...prev, point]);
        },
      );
    })();

    return () => {
      watcherRef.current?.remove();
      watcherRef.current = null;
    };
  }, [enabled, permissionGranted]);

  const resetRoute = () => setRoute([]);

  return {
    permissionGranted,
    currentPoint,
    route,
    resetRoute,
  };
}
