import { FlatList, RefreshControl, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from 'react-native-paper';
import { RideCard } from '@/components/rides/RideCard';
import { Loading } from '@/components/common/Loading';
import { useRideHistory } from '@/hooks/useRides';

export default function RideHistoryScreen() {
  const router = useRouter();
  const { data, isLoading, refetch, isRefetching } = useRideHistory();

  if (isLoading) return <Loading />;

  return (
    <FlatList
      contentContainerStyle={{ padding: 16, gap: 12 }}
      data={data ?? []}
      keyExtractor={(item) => String(item.id)}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      renderItem={({ item }) => (
        <RideCard ride={item} onPress={() => router.push({ pathname: '/(app)/ride-detail', params: { rideId: item.id } })} />
      )}
      ListEmptyComponent={
        <View style={{ paddingTop: 64 }}>
          <Text style={{ textAlign: 'center' }}>No rides found yet.</Text>
        </View>
      }
    />
  );
}
