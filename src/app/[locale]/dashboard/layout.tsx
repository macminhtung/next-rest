'use client';

import { useEffect, type ReactNode } from 'react';
import { useAppStore } from '@/store';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useMounted } from '@/common/hooks';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const curLocale = useLocale();
  const router = useRouter();
  const mounted = useMounted();
  const accessToken = useAppStore((state) => state.accessToken);

  // Prevent access to the dashboard when not logged in
  useEffect(() => {
    if (mounted && !accessToken) router.push(`/${curLocale}/signin`);
  }, [accessToken, mounted, curLocale, router]);

  if (!mounted || !accessToken) return null;

  return <>{children}</>;
};

export default DashboardLayout;
