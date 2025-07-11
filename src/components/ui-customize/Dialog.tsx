import type { ComponentProps, ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

type TDialogProps = ComponentProps<typeof Dialog> & {
  className?: string;
  title: ReactNode;
  description?: ReactNode;
  showFooter?: boolean;
};

export const DialogC = (props: TDialogProps) => {
  const { title, description, className, children, showFooter = true, ...dialogProps } = props;

  return (
    <Dialog {...dialogProps}>
      <DialogContent className={cn('max-w-[90vw] max-md:w-[500px]', className)}>
        <DialogHeader className='pb-3 border-b-[1px] border-border'>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        {showFooter && (
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DialogClose>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
