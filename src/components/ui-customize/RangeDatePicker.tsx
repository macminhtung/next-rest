'use client';

import { useState, type ComponentProps } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { Button, Calendar } from '@/components/ui';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type TDatePickerProps = Omit<ComponentProps<typeof Calendar>, 'onChange' | 'mode'> & {
  onChange?: (range: DateRange | undefined) => void;
};

export function RangeDatePickerC(props: TDatePickerProps) {
  const { onChange, className, numberOfMonths = 2, ...rest } = props;
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' className={cn('w-48 justify-between', className)}>
          <div className='font-semibold flex w-full max-w-[250px]'>
            <span>{fromDate ? fromDate.toLocaleDateString() : 'Select From'}</span>
            <span className='mx-auto'>{' —> '}</span>
            <span>{toDate ? toDate.toLocaleDateString() : 'Select To'}</span>
          </div>
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
        <Calendar
          {...rest}
          mode='range'
          numberOfMonths={numberOfMonths}
          selected={{ from: fromDate, to: toDate }}
          onSelect={(range) => {
            setFromDate(range?.from);
            setToDate(range?.to);
            if (onChange) onChange(range);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
