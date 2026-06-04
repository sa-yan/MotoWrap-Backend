import { Button as PaperButton } from 'react-native-paper';
import type { ComponentProps } from 'react';

type Props = ComponentProps<typeof PaperButton>;

export function Button(props: Props) {
  return <PaperButton mode="contained" {...props} />;
}
