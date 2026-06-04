import MapView, { Marker, Polyline } from 'react-native-maps';

type Point = {
  latitude: number;
  longitude: number;
};

type Props = {
  points: Point[];
};

export function RideMap({ points }: Props) {
  const fallback = { latitude: 20.5937, longitude: 78.9629, latitudeDelta: 0.5, longitudeDelta: 0.5 };
  const initialRegion = points[0]
    ? { ...points[0], latitudeDelta: 0.01, longitudeDelta: 0.01 }
    : fallback;

  return (
    <MapView style={{ height: 280, borderRadius: 12 }} initialRegion={initialRegion}>
      {points.length > 0 ? <Polyline coordinates={points} strokeWidth={4} /> : null}
      {points[0] ? <Marker coordinate={points[0]} title="Start" /> : null}
      {points.at(-1) ? <Marker coordinate={points.at(-1)!} title="Current/End" /> : null}
    </MapView>
  );
}
