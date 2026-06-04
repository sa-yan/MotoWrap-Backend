import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { useState } from 'react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/utils/errors';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const { login } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      setSubmitError(null);
      await login(values);
    } catch (error) {
      setSubmitError(getErrorMessage(error, 'Unable to login. Please try again.'));
    }
  };

  return (
    <View style={{ gap: 12 }}>
      <Controller
        control={control}
        name="email"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={Boolean(errors.email)}
          />
        )}
      />
      {errors.email ? <Text style={{ color: 'red' }}>{errors.email.message}</Text> : null}

      <Controller
        control={control}
        name="password"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label="Password"
            secureTextEntry
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={Boolean(errors.password)}
          />
        )}
      />
      {errors.password ? <Text style={{ color: 'red' }}>{errors.password.message}</Text> : null}

      {submitError ? <Text style={{ color: 'red' }}>{submitError}</Text> : null}

      <Button loading={isSubmitting} onPress={handleSubmit(onSubmit)}>
        Login
      </Button>
    </View>
  );
}
