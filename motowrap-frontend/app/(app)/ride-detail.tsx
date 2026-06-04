import { ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native-paper';
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
    return <Text style={{ textAlign: 'center', marginTop: 80 }}>Ride not found.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Text variant="titleLarge">Ride started {new Date(data.startTime).toLocaleString()}</Text>
      <RideMap points={data.route} />
      <RideStats
        distanceKm={data.distanceKm ?? 0}
        durationSeconds={data.durationSeconds ?? 0}
        averageSpeed={data.averageSpeed ?? 0}
      />
      <Text>Status: {data.status}</Text>
      <Text>Ended: {data.endTime ? new Date(data.endTime).toLocaleString() : 'In progress'}</Text>
      <Text>GPS points: {data.route.length}</Text>
    </ScrollView>
  );
}
