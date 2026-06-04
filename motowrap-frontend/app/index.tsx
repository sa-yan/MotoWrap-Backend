import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { Loading } from '@/components/common/Loading';

export default function Index() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return <Redirect href={isAuthenticated ? '/(app)/dashboard' : '/(auth)/login'} />;
}
