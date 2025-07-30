import { Checkbox } from '@/components/ui';
import { type CheckedState } from '@radix-ui/react-checkbox';

type TOriginCheckboxProps = React.ComponentProps<typeof Checkbox>;
type TCheckboxProps = TOriginCheckboxProps & {
  onChange?: (checkedState: CheckedState) => void; // Use for react-hook-form
};

export function CheckboxC(props: TCheckboxProps) {
  const { onChange, ...rest } = props;
  return <Checkbox {...rest} onCheckedChange={(v) => onChange && onChange(v)} />;
}
