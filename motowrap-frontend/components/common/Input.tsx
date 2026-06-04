import { TextInput } from 'react-native-paper';
import type { ComponentProps } from 'react';

type Props = ComponentProps<typeof TextInput>;

export function Input(props: Props) {
  return <TextInput mode="outlined" {...props} />;
}
