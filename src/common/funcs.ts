import { createElement } from 'react';
import { toast, type ExternalToast } from 'sonner';
import { X } from 'lucide-react';

export const showToastError = (
  error: Error,
  options?: Omit<ExternalToast, 'action' | 'actionButtonStyle'>
) =>
  toast.error(error?.message, {
    action: {
      label: createElement(X, { className: 'w-5 text-gray-700 dark:text-white' }),
      onClick: () => null,
    },
    actionButtonStyle: { backgroundColor: 'transparent' },
    duration: 2500,
    ...options,
  });
