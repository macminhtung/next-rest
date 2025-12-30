'use client';

import Header from '@/components/Header';
import { AppLoading } from '@/components/AppLoading';
import { useMounted } from '@/common/hooks';
import { useGetProfileQuery } from '@/react-query/auth';
import { useAppStore } from '@/store';

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const mounted = useMounted();
  const setAuthUser = useAppStore((state) => state.setAuthUser);
  const isAppLoading = useAppStore((state) => state.isAppLoading);
  const setIsAppLoading = useAppStore((state) => state.setIsAppLoading);
  const authUser = useAppStore((state) => state.authUser);
  const accessToken = useAppStore((state) => state.accessToken);

  // Get authProfile query
  useGetProfileQuery({
    onSuccess: (data) => setAuthUser(data),
    onLoading: (isLoading) => setIsAppLoading(isLoading),
    enabled: !!accessToken && !authUser.id,
  });

  if (!mounted || isAppLoading) return <AppLoading />;

  return (
    <div className='max-w-450 w-screen h-screen flex flex-col'>
      <Header />
      <div className='p-4 flex flex-1 flex-col overflow-hidden'>{children}</div>
    </div>
  );
};
