import type { ReactNode, ComponentProps } from 'react';
import { Input } from '@/components/ui';

type TOriginInputProps = ComponentProps<typeof Input>;
export type TInputCProps = TOriginInputProps & {
  startItem?: ReactNode;
  endItem?: ReactNode;
};

export const InputC = (props: TInputCProps) => {
  const { className, startItem, endItem, ...rest } = props;

  return (
    <div className='relative flex h-fit w-full'>
      {startItem && (
        <div className='absolute flex h-full items-center justify-center left-0'>{startItem}</div>
      )}
      <Input
        className={`${startItem && 'pl-10'} ${endItem && 'pr-10'} ${className} min-h-10`}
        {...rest}
      />
      {endItem && <div className='absolute top-3.25 right-3 cursor-pointer'>{endItem}</div>}
    </div>
  );
};
