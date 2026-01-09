'use client';

import { useState, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { ELanguage } from '@/common/enums';
import { manageAccessToken, EManageTokenType } from '@/common/client-funcs';
import {
  MoonIcon,
  SunMediumIcon,
  Menu,
  LogIn,
  LogOut,
  ListX,
  UserPen,
  ShoppingCart,
  X,
} from 'lucide-react';
import { ETheme } from '@/common/enums';
import { useAppStore, initAuthUser } from '@/store';
import { AvatarC, ButtonC, SelectC, SwitchC, DialogC } from '@/components/ui-customize';
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
  const { avatar, firstName, lastName } = useAppStore((state) => state.authUser);
  const setAuthUser = useAppStore((state) => state.setAuthUser);

  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const isDarkMode = useMemo(() => theme === ETheme.DARK, [theme]);

  const cartInfo = useAppStore((state) => state.cartInfo);
  const setCartInfo = useAppStore((state) => state.setCartInfo);
  const cartQuantity = useMemo(() => Object.keys(cartInfo).length, [cartInfo]);
  const [isOpenCartDialog, setIsOpenCartDialog] = useState(false);

  const removeCartItem = useCallback(
    (name: string) => {
      delete cartInfo[name];
      setCartInfo({ ...cartInfo });
    },
    [setCartInfo, cartInfo]
  );

  // Remove accessToken
  const removeAccessToken = useCallback(() => {
    router.push(`/${curLocale}/signin`);
    setAccessToken('');
    setAuthUser(initAuthUser);
    manageAccessToken({ type: EManageTokenType.SET, accessToken: '' });
  }, [curLocale, router, setAccessToken, setAuthUser]);

  // Handle signOut
  const signOutMutation = useSignOutMutation({
    onSuccess: () => removeAccessToken(),
    onError: () => removeAccessToken(),
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
          className='h-6 w-[2.65rem] cursor-pointer'
          thumbClassName='h-5 w-5 data-[state=checked]:translate-x-5'
        />

        <SelectC
          className='min-w-18 min-h-8 h-6!'
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
    <div className='flex items-center py-3 px-4 gap-2 border-b border-b-gray-900 h-16.5 dark:border-b-gray-300'>
      <AvatarC
        src='/logo.jpg'
        className={'rounded-[0.2rem] cursor-pointer size-10'}
        onClick={() => router.push(`/${curLocale}`)}
      />
      <div className='flex items-center justify-center gap-4 ml-auto'>
        <ButtonC
          className='h-8 rounded-md'
          onClick={() => setIsOpenCartDialog(true)}
          variant={'secondary'}
        >
          <ShoppingCart className='size-5' />
          {!!cartQuantity && <p className='text-red-400'>{cartQuantity}</p>}
        </ButtonC>

        <DialogC
          open={isOpenCartDialog}
          onOpenChange={() => setIsOpenCartDialog(false)}
          title={'Cart Information'}
          showFooter={false}
        >
          <div className='grid grid-cols-3 gap-5 '>
            {Object.keys(cartInfo).map((key) => (
              <div key={key} className='flex flex-col border rounded-md p-3'>
                <p>
                  {t('name')}: {key}
                </p>
                <p>
                  {t('price')}: {cartInfo[key].price}
                </p>
                <p>
                  {t('quantity')}: {cartInfo[key].quantity}
                </p>
                <ButtonC onClick={() => removeCartItem(key)}>
                  <X className='text-red-500' />
                  Remove
                </ButtonC>
              </div>
            ))}
          </div>
        </DialogC>

        {accessToken ? (
          // # ============== #
          // # ==> LOGGED <== #
          // # ============== #
          <>
            <span className='font-semibold text-sm'>{`${firstName} ${lastName}`}</span>
            <AvatarC
              src={avatar || 'https://github.com/shadcn.png'}
              className='rounded-[50%] size-10'
            />
            <DropdownMenu open={isOpenMenu} onOpenChange={setIsOpenMenu}>
              <DropdownMenuTrigger asChild>
                <ButtonC variant='outline' className='w-10 h-10'>
                  {isOpenMenu ? <ListX className='size-5' /> : <Menu className='size-5' />}
                </ButtonC>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='min-w-fit w-32 p-1.5 absolute -right-5.5 top-1'>
                <DropdownMenuLabel>{themeAndLang}</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => router.push(`/${curLocale}/dashboard/profile`)}>
                  <UserPen className='size-5 mr-2 text-primary' />
                  <span>{t('profile')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => signOutMutation.mutate(undefined)}
                  disabled={signOutMutation.isPending}
                >
                  <LogOut className='size-5 mr-2 text-primary' />
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
            <ButtonC className='h-8' onClick={() => router.push(`/${curLocale}/signin`)}>
              <LogIn /> {t('signIn')}
            </ButtonC>
            <div className='w-0.5 h-6.25 bg-gray-900 dark:bg-gray-300' />
            {themeAndLang}
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
