import type { ComponentProps } from 'react';
import { RadioGroup, RadioGroupItem, Label } from '@/components/ui';
import type { ISelectOption } from '@/components/ui-customize';
import { cn } from '@/lib/utils';

export type TRadioGroupProps = Omit<ComponentProps<typeof RadioGroup>, 'onChange'> & {
  options: ISelectOption[];
  onChange?: (v: string) => void;
};

export const RadioGroupC = (props: TRadioGroupProps) => {
  const { options, defaultValue, className, onChange, ...rest } = props;

  return (
    <RadioGroup
      {...rest}
      className={cn('mt-1', className)}
      defaultValue={defaultValue || options[0].value}
      onValueChange={onChange && ((v) => onChange(v))}
    >
      {options.map((o, idx) => (
        <div key={`${idx}-${o.value}`} className='flex items-center space-x-2 w-fit'>
          <RadioGroupItem value={o.value} id={`${o.value}`} />
          <Label htmlFor={`${o.value}`}>{o.label}</Label>
        </div>
      ))}
    </RadioGroup>
  );
};
