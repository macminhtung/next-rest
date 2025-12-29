'use client';

import { useState, useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { CheckIcon, XCircle, ChevronDown, XIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ISelectOption } from '@/components/ui-customize';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';

export type TMultiSelectCProps = {
  options: ISelectOption[];
  value?: ISelectOption['value'][]; // Use for react-hook-form
  onChange?: (v: string[]) => void; // Use for react-hook-form
  className?: string;
  placeholder?: string;
  loading?: boolean;
  onSearch?: (e: ChangeEvent<HTMLInputElement>) => void; // Use for searching
  maxShow?: number; // Maximum number of items to display [Optional - Defaults: 3]
};

export const MultiSelectC = (props: TMultiSelectCProps) => {
  const {
    options,
    onChange,
    value = [],
    placeholder = 'Select options',
    maxShow = 3,
    className,
    loading,
    onSearch,
  } = props;
  const [selectedValues, setSelectedValues] = useState<string[]>(value);

  // Toggle option value
  const toggleOptionValue = useCallback(
    (optionValue: string) => {
      const newSelectedValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((value) => value !== optionValue)
        : [...selectedValues, optionValue];
      setSelectedValues(newSelectedValues);
      if (onChange) onChange(newSelectedValues);
    },
    [onChange, selectedValues]
  );

  // Clear all selected values
  const handleClearAll = useCallback(() => {
    setSelectedValues([]);
    if (onChange) onChange([]);
  }, [onChange]);

  // Toggle select all checkbox
  const toggleSelectAllCheckbox = useCallback(() => {
    if (selectedValues.length === options.length) {
      handleClearAll();
    } else {
      const allValues = options.map((option) => option.value);
      setSelectedValues(allValues);
      if (onChange) onChange(allValues);
    }
  }, [handleClearAll, onChange, options, selectedValues.length]);

  return (
    <Popover>
      <PopoverTrigger disabled={loading}>
        <Button
          className={cn(
            'flex w-full min-w-52 py-0 px-1 border min-h-10 h-auto items-center justify-between bg-inherit hover:bg-inherit [&_svg]:pointer-events-auto',
            className
          )}
          disabled={loading}
          asChild
        >
          {selectedValues.length > 0 ? (
            <div className='flex justify-between items-center w-full !p-[5px]'>
              <div className='flex flex-wrap items-center gap-[5px]'>
                {selectedValues.slice(0, maxShow).map((value, idx) => {
                  const option = options.find((o) => o.value === value);
                  return (
                    <Badge
                      key={`${idx}-${value}`}
                      className='h-8 text-md border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    >
                      {option?.label}
                      <div className='ml-2 h-4 w-4 cursor-pointer'>
                        <XCircle
                          className='size-4'
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleOptionValue(value);
                          }}
                        />
                      </div>
                    </Badge>
                  );
                })}
                {selectedValues.length > maxShow && (
                  <Badge className='h-8 text-md border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80'>
                    {`+ ${selectedValues.length - maxShow} more`}
                  </Badge>
                )}
              </div>

              <div className='flex items-center justify-between [&_svg]:text-primary'>
                {loading ? (
                  <Loader2 className='animate-spin text-primary size-4 mx-2' />
                ) : (
                  <>
                    <XIcon
                      className='h-4 mx-2 cursor-pointer text-primary size-4'
                      onClick={(event) => {
                        event.stopPropagation();
                        handleClearAll();
                      }}
                    />
                    <Separator orientation='vertical' className='flex min-h-6 h-full' />
                    <ChevronDown className='h-4 mx-2 cursor-pointer text-primary size-4' />
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className='flex items-center justify-between w-full mx-auto'>
              <span className='text-md text-primary'>{placeholder}</span>
              {loading ? (
                <Loader2 className='animate-spin text-primary size-4' />
              ) : (
                <ChevronDown className='h-4 cursor-pointer text-primary mx-2 size-4' />
              )}
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Command className='min-w-52' onChange={onSearch}>
          {onSearch && <CommandInput className='min-h-10 [&_svg]:size-4' placeholder='Search...' />}
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup className='[&>div]:grid [&>div]:gap-1'>
              <CommandItem key='all' onSelect={toggleSelectAllCheckbox} className='cursor-pointer'>
                <div
                  className={cn(
                    'flex items-center justify-center rounded-sm border border-primary',
                    selectedValues.length === options.length
                      ? 'bg-primary text-primary dark:bg-background'
                      : 'opacity-50 [&_svg]:invisible'
                  )}
                >
                  <CheckIcon />
                </div>
                <span className='font-semibold'>Select All</span>
              </CommandItem>
              {options.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => toggleOptionValue(option.value)}
                    className={cn('cursor-pointer transition-all', isSelected && 'bg-border/40')}
                  >
                    <div
                      className={cn(
                        'flex items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary dark:bg-background'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <CheckIcon />
                    </div>
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandSeparator />
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
