import { View } from 'react-native';
import { Card, Chip, Text } from 'react-native-paper';
import type { Ride } from '@/types';

type Props = {
  ride: Ride;
  onPress: () => void;
};

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function RideCard({ ride, onPress }: Props) {
  const date = new Date(ride.startTime);

  return (
    <Card onPress={onPress}>
      <Card.Title
        title={date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
        subtitle={date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
        right={() => (
          <Chip
            style={{ marginRight: 12, backgroundColor: ride.status === 'active' ? '#e8f5e9' : '#f5f5f5' }}
            textStyle={{ color: ride.status === 'active' ? 'green' : '#666', fontSize: 11 }}
          >
            {ride.status === 'active' ? 'Active' : 'Done'}
          </Chip>
        )}
      />
      <Card.Content>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ alignItems: 'center' }}>
            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
              {(ride.distanceKm ?? 0).toFixed(2)}
            </Text>
            <Text variant="bodySmall" style={{ color: '#888' }}>km</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
              {formatDuration(ride.durationSeconds ?? 0)}
            </Text>
            <Text variant="bodySmall" style={{ color: '#888' }}>duration</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
              {(ride.averageSpeed ?? 0).toFixed(1)}
            </Text>
            <Text variant="bodySmall" style={{ color: '#888' }}>avg km/h</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
              {(ride.maxSpeed ?? 0).toFixed(1)}
            </Text>
            <Text variant="bodySmall" style={{ color: '#888' }}>top km/h</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}
