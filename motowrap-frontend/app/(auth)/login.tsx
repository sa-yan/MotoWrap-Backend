import { View } from 'react-native';
import { Link } from 'expo-router';
import { Card, Text } from 'react-native-paper';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Card>
        <Card.Title title="MotoWrap Login" />
        <Card.Content style={{ gap: 16 }}>
          <LoginForm />
          <Text>
            New here? <Link href="/(auth)/register">Create an account</Link>
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
}
