import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type TSpinnerProps = { className?: string; children?: React.ReactNode };

export function SpinnerC({ className }: TSpinnerProps) {
  return <Loader2 className={cn('animate-spin text-primary size-8', className)} />;
}
