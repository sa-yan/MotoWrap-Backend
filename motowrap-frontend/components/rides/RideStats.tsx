import { Card, Text } from 'react-native-paper';

type Props = {
  distanceKm: number;
  durationSeconds: number;
  averageSpeed: number;
};

export function RideStats({ distanceKm, durationSeconds, averageSpeed }: Props) {
  return (
    <Card>
      <Card.Title title="Ride Stats" />
      <Card.Content>
        <Text>Distance: {distanceKm.toFixed(2)} km</Text>
        <Text>Duration: {Math.round(durationSeconds / 60)} min</Text>
        <Text>Average speed: {averageSpeed.toFixed(2)} km/h</Text>
      </Card.Content>
    </Card>
  );
}
