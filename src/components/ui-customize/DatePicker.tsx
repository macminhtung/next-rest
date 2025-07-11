'use client';

import { useState, type ComponentProps } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { Button, Calendar } from '@/components/ui';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type TDatePickerProps = Omit<ComponentProps<typeof Calendar>, 'onChange' | 'mode'> & {
  onChange?: (v: Date | undefined) => void;
};

export const DatePickerC = (props: TDatePickerProps) => {
  const { onChange, className, ...rest } = props;
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' className={cn('w-48 justify-between font-normal', className)}>
          <span className='font-semibold'>{date ? date.toLocaleDateString() : 'Select date'}</span>
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
        <Calendar
          {...rest}
          mode='single'
          selected={date}
          captionLayout='dropdown'
          onSelect={(date) => {
            setDate(date);
            setOpen(false);
            if (onChange) onChange(date);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
