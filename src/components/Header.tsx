'use client';

import { memo, useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { ELanguage } from '@/common/enums';
import { manageAccessToken, EManageTokenType } from '@/common/client-funcs';
import { MoonIcon, SunMediumIcon, Menu, LogIn, LogOut, ListX, UserPen } from 'lucide-react';
import { ETheme } from '@/common/enums';
import { useAppStore } from '@/store';
import { AvatarC, ButtonC, SelectC, SwitchC } from '@/components/ui-customize';
import { usePathname, useRouter as useRouterI18n } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useSignOutMutation } from '@/react-query/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui';

const languageOptions = Object.values(ELanguage).map((key) => ({
  label: <p className='font-semibold'>{key.toUpperCase()}</p>,
  value: key,
}));

const Header = () => {
  const t = useTranslations();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const routerI18n = useRouterI18n();
  const curLocale = useLocale();
  const router = useRouter();

  const accessToken = useAppStore((state) => state.accessToken);
  const setAccessToken = useAppStore((state) => state.setAccessToken);
  const authUser = useAppStore((state) => state.authUser);

  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const isDarkMode = useMemo(() => theme === ETheme.DARK, [theme]);

  // Handle signOut
  const signOutMutation = useSignOutMutation({
    onSuccess: () => {
      setAccessToken('');
      manageAccessToken({ type: EManageTokenType.SET, accessToken: '' });
      router.push(`/${curLocale}/signin`);
    },
  });

  // # ======================== #
  // # ==> THEME & LANGUAGE <== #
  // # ======================== #
  const themeAndLang = useMemo(
    () => (
      <div
        className={cn(
          'flex items-center justify-center gap-4 my-1',
          accessToken && 'border-b border-primary pb-4'
        )}
      >
        <SwitchC
          icon={
            isDarkMode ? <MoonIcon className='h-4 w-4' /> : <SunMediumIcon className='h-4 w-4' />
          }
          checked={isDarkMode}
          onCheckedChange={(checked) => setTheme(checked ? ETheme.DARK : ETheme.LIGHT)}
          className='h-6 w-[2.65rem]'
          thumbClassName='h-5 w-5 data-[state=checked]:translate-x-5'
        />

        <SelectC
          className='min-w-18 min-h-8 !h-6'
          popoverClassName='min-w-18 max-w-fit'
          value={curLocale}
          options={languageOptions}
          onChange={(lang) => routerI18n.push(pathname, { locale: lang })}
        />
      </div>
    ),
    [curLocale, isDarkMode, accessToken, pathname, routerI18n, setTheme]
  );

  return (
    <div className='flex items-center p-3 gap-2 border-b-[1px] border-b-gray-900 h-[66px] dark:border-b-gray-300'>
      <AvatarC
        src='/logo.jpg'
        className={'rounded-[0.2rem] cursor-pointer size-10'}
        onClick={() => router.push(`/${curLocale}`)}
      />
      <div className='flex items-center justify-center gap-4 ml-auto'>
        {accessToken ? (
          // # ============== #
          // # ==> LOGGED <== #
          // # ============== #
          <>
            <AvatarC
              src={authUser.avatar || 'https://github.com/shadcn.png'}
              className='rounded-[50%] size-10'
            />
            <DropdownMenu open={isOpenMenu} onOpenChange={setIsOpenMenu}>
              <DropdownMenuTrigger asChild>
                <ButtonC variant='outline'>
                  {isOpenMenu ? (
                    <ListX className='scale-[1.5]' />
                  ) : (
                    <Menu className='scale-[1.5]' />
                  )}
                </ButtonC>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='min-w-fit w-32 p-1.5 absolute right-[-22px] top-[4px]'>
                <DropdownMenuLabel>{themeAndLang}</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => router.push(`/${curLocale}/dashboard/profile`)}>
                  <UserPen className='scale-[1.3] mr-2 text-primary' />
                  <span>{t('profile')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => signOutMutation.mutate(undefined)}
                  disabled={signOutMutation.isPending}
                >
                  <LogOut className='scale-[1.2] mr-2 text-primary' />
                  <span>{t('signOut')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          // # ================= #
          // # ==> UN-LOGGED <== #
          // # ================= #
          <>
            {pathname !== '/signin' && (
              <>
                <ButtonC className='h-8' onClick={() => router.push(`/${curLocale}/signin`)}>
                  <LogIn /> {t('signIn')}
                </ButtonC>
                <div className='w-[2px] h-[25px] bg-gray-900 dark:bg-gray-300' />
              </>
            )}
            {themeAndLang}
          </>
        )}
      </div>
    </div>
  );
};

export default memo(Header);
