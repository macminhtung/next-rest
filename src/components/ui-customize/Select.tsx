'use client';

import { useState } from 'react';
import type { ReactNode, ChangeEvent } from 'react';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandGroup,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
} from '@/components/ui';
import { cn } from '@/lib/utils';
import { Loader2, ChevronDown } from 'lucide-react';

export interface ISelectOption {
  label: ReactNode;
  value: string;
  disabled?: boolean;
}

export type TSelectProps = {
  options: ISelectOption[];
  value?: ISelectOption['value']; // Use for react-hook-form
  onChange?: (value: string) => void; // Use for react-hook-form
  className?: string;
  loading?: boolean;
  placeholder?: string;
  onSearch?: (e: ChangeEvent<HTMLInputElement>) => void; // Use for searching
  popoverClassName?: string;
};

export const SelectC = (props: TSelectProps) => {
  const {
    options = [],
    popoverClassName,
    className,
    placeholder = 'Select option',
    loading,
    value,
    onChange,
    onSearch,
  } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [oValue, setOValue] = useState<string>(value ? value.toString() : placeholder);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={loading}>
        <Button
          variant='outline'
          className={cn('min-w-52 w-fit justify-between relative min-h-10', className)}
        >
          {options.find((o) => o.value === oValue)?.label || placeholder}
          {loading ? (
            <Loader2 className='absolute right-[12px] animate-spin text-primary size-4' />
          ) : (
            <ChevronDown className='ml-auto opacity-50' />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('min-w-52 p-0 w-fit', popoverClassName)} align='start'>
        <Command onChange={onSearch}>
          {onSearch && <CommandInput placeholder='Search...' className='h-9' />}
          <CommandList>
            <CommandEmpty>No option.</CommandEmpty>
            <CommandGroup>
              {options.map(({ value, label }, idx) => (
                <CommandItem
                  className={cn(
                    'm-1 cursor-pointer transition-all',
                    value === oValue && 'bg-border/40 font-semibold'
                  )}
                  key={`${idx}-${value}`}
                  value={value}
                  onSelect={(curValue: string) => {
                    setOValue(curValue);
                    setOpen(false);
                    if (onChange) onChange(curValue);
                  }}
                >
                  {label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
