import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, Text } from 'react-native-paper';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <View style={{ flex: 1, padding: 16, gap: 16 }}>
      <Card>
        <Card.Title title={`Welcome, ${user?.name ?? 'Rider'}`} subtitle={user?.email} />
      </Card>
      <Button onPress={() => router.push('/(app)/ride-tracking')}>Start Ride Tracking</Button>
      <Button mode="outlined" onPress={() => router.push('/(app)/ride-history')}>
        View Ride History
      </Button>
      <Button mode="text" onPress={logout}>
        Logout
      </Button>
      <Text>Tip: keep location enabled for accurate GPS route tracking.</Text>
    </View>
  );
}
