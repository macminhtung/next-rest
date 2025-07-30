'use client';

import type { ReactNode } from 'react';
import { Switch } from '@/components/ui';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { type CheckedState } from '@radix-ui/react-checkbox';
import { cn } from '@/lib/utils';

type TOriginSwitchProps = React.ComponentProps<typeof Switch>;
type TSwitchProps = TOriginSwitchProps & {
  icon?: ReactNode;
  className?: string;
  thumbClassName?: string;
  onChange?: (checkedState: CheckedState) => void; // Use for react-hook-form
};

export function SwitchC(props: TSwitchProps) {
  const { onChange, className, thumbClassName, icon, onCheckedChange, ...rest } = props;

  return (
    <SwitchPrimitives.Root
      className={cn(
        'peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...rest}
      onCheckedChange={
        onCheckedChange &&
        ((v) => {
          onCheckedChange(v);
          if (onChange) onChange(v);
        })
      }
    >
      <SwitchPrimitives.Thumb
        className={cn(
          'bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0 flex items-center justify-center',
          thumbClassName
        )}
      >
        {icon && icon}
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
  );
}
