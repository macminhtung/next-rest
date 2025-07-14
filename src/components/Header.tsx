'use client';

import { useCallback, useState, useMemo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { ELanguage } from '@/common/enums';
import { manageTokens, EManageTokenType } from '@/common/funcs';
import { MoonIcon, SunMediumIcon, Menu, LogOut, ListX } from 'lucide-react';
import { ETheme } from '@/common/enums';
import { useAuthSelector } from '@/context/useAuthContext';
import { AvatarC, ButtonC, SelectC, SwitchC } from '@/components/ui-customize';
import { usePathname, useRouter as useRouterI18n } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
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
  const pathname = usePathname();
  const routerI18n = useRouterI18n();
  const curLocale = useLocale();

  const router = useRouter();
  const tokens = useAuthSelector((ctx) => ctx.tokens);
  const setTokens = useAuthSelector((ctx) => ctx.setTokens);
  const authUser = useAuthSelector((ctx) => ctx.authUser);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const isDarkMode = useMemo(() => theme === ETheme.DARK, [theme]);
  const isLoggedIn = useMemo(() => !!tokens.accessToken, [tokens.accessToken]);

  const signOut = useCallback(() => {
    const noneTokens = { accessToken: '', refreshToken: '' };
    setTokens(noneTokens);
    manageTokens({ type: EManageTokenType.SET, ...noneTokens });
  }, [setTokens]);

  const themeAndLang = useMemo(
    () => (
      <div
        className={cn(
          'flex items-center justify-center gap-4 pb-4 my-1',
          isLoggedIn && 'border-b border-primary'
        )}
      >
        <SwitchC
          icon={
            isDarkMode ? <MoonIcon className='h-4 w-4' /> : <SunMediumIcon className='h-4 w-4' />
          }
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
    [curLocale, isDarkMode, isLoggedIn, pathname, routerI18n, setTheme]
  );

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className='flex items-center p-3 gap-2 border-b-[1px] border-b-gray-900 h-[66px] dark:border-b-gray-300'>
      <AvatarC
        src='/logo.jpg'
        className={'rounded-[0.2rem] cursor-pointer size-10'}
        onClick={() => router.push('/en')}
      />
      <div className='flex items-center gap-4 ml-auto'>
        {isLoggedIn ? (
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
                <DropdownMenuItem onClick={signOut}>
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
          themeAndLang
        )}
      </div>
    </div>
  );
};

export default Header;
