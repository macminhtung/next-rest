'use client';

import { ReactNode } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';

type TAlertDialogProps = {
  isOpen: boolean;
  title: ReactNode;
  description?: ReactNode;
  cancelAction: () => void;
  continueAction: () => void;
  isLoading?: boolean;
};

export const AlertDialogC = (props: TAlertDialogProps) => {
  const { isOpen, title, description, cancelAction, continueAction, isLoading } = props;
  const t = useTranslations();

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={cancelAction && (() => cancelAction())} disabled={isLoading}>
            {t('cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={continueAction && (() => continueAction())}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className='animate-spin text-white dark:text-black size-4' />}
            {t('continue')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
