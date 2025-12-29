import { Loader } from 'lucide-react';

export const AppLoading = () => (
  <div className='absolute bg-background flex h-full w-full items-center justify-center z-10'>
    <Loader className='size-40 animate-spin-2s' />
  </div>
);
