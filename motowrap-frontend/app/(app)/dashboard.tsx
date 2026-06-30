import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, Divider, Text } from 'react-native-paper';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { useRideStats } from '@/hooks/useRides';

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
      <Text variant="bodyMedium" style={{ color: '#666' }}>{label}</Text>
      <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>{value}</Text>
    </View>
  );
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

export default function DashboardScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { data: stats } = useRideStats();

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Card>
        <Card.Title
          title={`Welcome, ${user?.name ?? 'Rider'}`}
          subtitle={user?.email}
        />
      </Card>

      <Card>
        <Card.Title title="Your Stats" />
        <Card.Content>
          <StatRow
            label="Total Rides"
            value={stats ? String(stats.totalRides) : '—'}
          />
          <Divider />
          <StatRow
            label="Total Distance"
            value={stats ? `${stats.totalDistanceKm.toFixed(2)} km` : '—'}
          />
          <Divider />
          <StatRow
            label="Total Time"
            value={stats ? formatDuration(stats.totalDurationSeconds) : '—'}
          />
          <Divider />
          <StatRow
            label="Avg Speed"
            value={stats ? `${stats.overallAvgSpeed.toFixed(1)} km/h` : '—'}
          />
          <Divider />
          <StatRow
            label="Top Speed"
            value={stats ? `${stats.overallMaxSpeed.toFixed(1)} km/h` : '—'}
          />
        </Card.Content>
      </Card>

      <Button onPress={() => router.push('/(app)/ride-tracking')}>
        Start Ride Tracking
      </Button>
      <Button mode="outlined" onPress={() => router.push('/(app)/ride-history')}>
        View Ride History
      </Button>
      <Button mode="text" onPress={logout}>
        Logout
      </Button>
    </ScrollView>
  );
}
