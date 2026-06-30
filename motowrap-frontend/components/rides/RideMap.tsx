import { StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

type Point = {
  latitude: number;
  longitude: number;
};

type Props = {
  points: Point[];
  style?: object;
};

export function RideMap({ points, style }: Props) {
  const fallback = { latitude: 20.5937, longitude: 78.9629, latitudeDelta: 0.5, longitudeDelta: 0.5 };
  const initialRegion = points[0]
    ? { ...points[0], latitudeDelta: 0.01, longitudeDelta: 0.01 }
    : fallback;

  return (
    <MapView style={[styles.map, style]} initialRegion={initialRegion}>
      {points.length > 0 && <Polyline coordinates={points} strokeWidth={4} strokeColor="#d32f2f" />}
      {points[0] && <Marker coordinate={points[0]} title="Start" pinColor="green" />}
      {points.length > 1 && (
        <Marker coordinate={points[points.length - 1]} title="Current" pinColor="#d32f2f" />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    minHeight: 200,
  },
});
