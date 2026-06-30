import { View } from 'react-native';
import { Card, Text } from 'react-native-paper';

type Props = {
  distanceKm: number;
  durationSeconds: number;
  averageSpeed: number;
  maxSpeed?: number;
};

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>{value}</Text>
      <Text variant="bodySmall" style={{ color: '#888' }}>{label}</Text>
    </View>
  );
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function RideStats({ distanceKm, durationSeconds, averageSpeed, maxSpeed }: Props) {
  return (
    <Card>
      <Card.Title title="Ride Stats" />
      <Card.Content>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <StatBox label="Distance" value={`${distanceKm.toFixed(2)} km`} />
          <StatBox label="Duration" value={formatDuration(durationSeconds)} />
          <StatBox label="Avg Speed" value={`${averageSpeed.toFixed(1)} km/h`} />
          {maxSpeed !== undefined && (
            <StatBox label="Top Speed" value={`${maxSpeed.toFixed(1)} km/h`} />
          )}
        </View>
      </Card.Content>
    </Card>
  );
}
