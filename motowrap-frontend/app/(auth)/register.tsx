import { View } from 'react-native';
import { Link } from 'expo-router';
import { Card, Text } from 'react-native-paper';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Card>
        <Card.Title title="Create MotoWrap account" />
        <Card.Content style={{ gap: 16 }}>
          <RegisterForm />
          <Text>
            Already have an account? <Link href="/(auth)/login">Login</Link>
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
}
