import { ActivityIndicator } from 'react-native-paper';
import { View } from 'react-native';

export function Loading() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
