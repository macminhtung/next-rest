import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const LoadingOverlay = (props: { className?: string }) => {
  return (
    <div
      className={cn(
        'absolute z-10 bg-neutral-400 opacity-60 dark:bg-neutral-800 size-full flex items-center justify-center rounded-lg',
        props.className
      )}
    >
      <Loader2 className={'animate-spin text-primary size-10'} />
    </div>
  );
};
