import { Card, Text } from 'react-native-paper';
import type { Ride } from '@/types';

type Props = {
  ride: Ride;
  onPress: () => void;
};

export function RideCard({ ride, onPress }: Props) {
  return (
    <Card onPress={onPress}>
      <Card.Title title={new Date(ride.startTime).toLocaleString()} subtitle={ride.status} />
      <Card.Content>
        <Text>Distance: {ride.distanceKm?.toFixed(2) ?? '0.00'} km</Text>
        <Text>Duration: {Math.round((ride.durationSeconds ?? 0) / 60)} min</Text>
        <Text>Avg Speed: {ride.averageSpeed?.toFixed(2) ?? '0.00'} km/h</Text>
      </Card.Content>
    </Card>
  );
}
