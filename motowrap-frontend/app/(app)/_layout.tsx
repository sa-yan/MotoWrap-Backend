import { Redirect, Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';

export default function AppLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (!loading && !isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="dashboard" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="ride-tracking"
        options={{
          title: 'Track Ride',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="navigation" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="ride-history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="history" color={color} size={size} />,
        }}
      />
      <Tabs.Screen name="ride-detail" options={{ href: null }} />
    </Tabs>
  );
}
