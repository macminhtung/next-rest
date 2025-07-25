'use client';

import { useEffect } from 'react';
import Header from '@/components/Header';
import { Toaster } from '@/components/ui/sonner';
import { usePathname } from 'next/navigation';
import { AppLoading } from '@/components/AppLoading';
import { useMounted } from '@/common/hooks';
import { useGetAuthProfileQuery } from '@/react-query/auth';
import { useAppStore } from '@/store';

export const ClientLayout = (props: { children: React.ReactNode }) => {
  const mounted = useMounted();
  const pathname = usePathname();
  const setAuthUser = useAppStore((state) => state.setAuthUser);
  const isAppLoading = useAppStore((state) => state.isAppLoading);
  const setIsAppLoading = useAppStore((state) => state.setIsAppLoading);
  const authUser = useAppStore((state) => state.authUser);
  const accessToken = useAppStore((state) => state.accessToken);

  // Show loading page when processing pathname changes
  useEffect(() => {
    setIsAppLoading(true);
    const timeout = setTimeout(() => setIsAppLoading(false), 300);
    return () => clearTimeout(timeout);
  }, [pathname, setIsAppLoading]);

  // Get authProfile query
  useGetAuthProfileQuery(undefined, {
    onSuccess: (data) => setAuthUser(data),
    onLoading: (isLoading) => setIsAppLoading(isLoading),
    enabled: !!accessToken && !authUser.id,
  });

  if (!mounted || isAppLoading) return <AppLoading />;

  return (
    <div className='max-w-[1800px] w-full h-full flex flex-col'>
      <Toaster position='top-right' />
      <Header />
      <div className='flex p-3 h-[calc(100vh-66px)] overflow-auto'>
        <div className='p-3 flex flex-1 justify-center h-fit'>{props.children}</div>
      </div>
    </div>
  );
};
