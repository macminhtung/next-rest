'use client';

import { create, StoreApi } from 'zustand';
import { ELocalStorageKey, ETheme } from '@/common/enums';
import { manageAccessToken, EManageTokenType } from '@/common/client-funcs';

type Get<T, K, F> = K extends keyof T ? T[K] : F;

export type TAuthUser = {
  id: string;
  avatar: string;
  email: string;
  firstName: string;
  lastName: string;
  roleId: number;
};

export const initAuthUser: TAuthUser = {
  id: '',
  avatar: '',
  email: '',
  firstName: '',
  lastName: '',
  roleId: 0,
};

type TAppState = {
  isAppLoading: boolean;
  setIsAppLoading: (isLoading: boolean) => void;
  theme: ETheme;
  setTheme: (theme: ETheme) => void;
  accessToken: string;
  setAccessToken: (token: string) => void;
  authUser: TAuthUser;
  setAuthUser: (authUser: TAuthUser) => void;
};

export const useAppStore = create<TAppState>((set) => ({
  isAppLoading: false,
  setIsAppLoading: (isAppLoading) => set({ isAppLoading }),
  theme:
    typeof window !== 'undefined'
      ? localStorage?.getItem(ELocalStorageKey.UI_THEME) === ETheme.LIGHT
        ? ETheme.LIGHT
        : ETheme.DARK
      : ETheme.DARK,
  setTheme: (theme) => set({ theme }),
  accessToken: manageAccessToken({ type: EManageTokenType.GET }),
  setAccessToken: (tokens) => set({ accessToken: tokens }),
  authUser: initAuthUser,
  setAuthUser: (authUser) => set({ authUser }),
}));
