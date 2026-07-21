'use client';

import { create } from 'zustand';
import { manageAccessToken, EManageTokenType } from '@/common/client-funcs';

// #======================#
// # ==> DEFINE TYPES <== #
// #======================#
export type TAuthUser = {
  id: string;
  avatar: string;
  email: string;
  firstName: string;
  lastName: string;
  roleId: number;
};

export type TCartInfo = { [name: string]: { quantity: number; unitPrice: number } };

type TAppState = {
  isAppLoading: boolean;
  setIsAppLoading: (isLoading: boolean) => void;
  accessToken: string;
  setAccessToken: (token: string) => void;
  authUser: TAuthUser;
  setAuthUser: (authUser: TAuthUser) => void;
  cartInfo: TCartInfo;
  setCartInfo: (cartInfo: TCartInfo) => void;
};

// #===========================#
// # ==> INITIALIZE VALUES <== #
// #===========================#
export const initAuthUser: TAuthUser = {
  id: '',
  avatar: '',
  email: '',
  firstName: '',
  lastName: '',
  roleId: 0,
};

// #====================#
// # ==> STORE HOOK <== #
// #====================#
export const useAppStore = create<TAppState>((set) => ({
  isAppLoading: false,
  setIsAppLoading: (isAppLoading) => set({ isAppLoading }),
  accessToken: manageAccessToken({ type: EManageTokenType.GET }),
  setAccessToken: (tokens) => set({ accessToken: tokens }),
  authUser: initAuthUser,
  setAuthUser: (authUser) => set({ authUser }),
  cartInfo: {},
  setCartInfo: (cartInfo) => set({ cartInfo }),
}));
