import { Loader } from 'lucide-react';

export const AppLoading = () => (
  <div className='absolute bg-background flex h-full w-full items-center justify-center z-50'>
    <Loader className='scale-[6] animate-spin-2s' />
  </div>
);
