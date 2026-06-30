import { ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Card, Text } from 'react-native-paper';
import { Loading } from '@/components/common/Loading';
import { RideMap } from '@/components/rides/RideMap';
import { RideStats } from '@/components/rides/RideStats';
import { useRideDetail } from '@/hooks/useRides';

export default function RideDetailScreen() {
  const params = useLocalSearchParams<{ rideId?: string }>();
  const rideId = params.rideId ? Number(params.rideId) : undefined;
  const { data, isLoading } = useRideDetail(rideId);

  if (isLoading) return <Loading />;

  if (!data) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text variant="bodyLarge">Ride not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Card>
        <Card.Content>
          <Text variant="titleMedium">
            {new Date(data.startTime).toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
          <Text variant="bodyMedium" style={{ color: '#666', marginTop: 4 }}>
            {new Date(data.startTime).toLocaleTimeString()} →{' '}
            {data.endTime ? new Date(data.endTime).toLocaleTimeString() : 'In progress'}
          </Text>
          <Text
            variant="bodySmall"
            style={{ marginTop: 4, color: data.status === 'active' ? 'green' : '#888' }}
          >
            {data.status === 'active' ? 'Active' : 'Completed'} · {data.route.length} GPS points
          </Text>
        </Card.Content>
      </Card>

      <RideMap points={data.route} />

      <RideStats
        distanceKm={data.distanceKm ?? 0}
        durationSeconds={data.durationSeconds ?? 0}
        averageSpeed={data.averageSpeed ?? 0}
        maxSpeed={data.maxSpeed ?? 0}
      />
    </ScrollView>
  );
}
