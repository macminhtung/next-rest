'use client';

import { useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { createContext, useContext, useState } from 'react';
import { ELocalStorageKey } from '@/common/enums';

export enum ETheme {
  DARK = 'dark',
  LIGHT = 'light',
}

interface IAppContext {
  isAppLoading: boolean;
  setIsAppLoading: Dispatch<SetStateAction<boolean>>;
  theme: ETheme;
  setTheme: Dispatch<SetStateAction<ETheme>>;
}

const initValues: IAppContext = {
  isAppLoading: false,
  setIsAppLoading: () => null,
  theme:
    typeof window !== 'undefined'
      ? localStorage?.getItem(ELocalStorageKey.UI_THEME) === ETheme.LIGHT
        ? ETheme.LIGHT
        : ETheme.DARK
      : ETheme.DARK,
  setTheme: () => null,
};

export const AppContext = createContext<IAppContext>(initValues);

export const useAppContextValue = (): IAppContext => {
  const [isAppLoading, setIsAppLoading] = useState<boolean>(initValues.isAppLoading);
  const [theme, setTheme] = useState<ETheme>(initValues.theme);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Remove prev theme
      const root = window.document.documentElement;
      root.classList.remove(theme === ETheme.LIGHT ? ETheme.DARK : ETheme.LIGHT);

      // Add new theme
      root.classList.add(theme);

      // Update theme to localStorage
      localStorage.setItem(ELocalStorageKey.UI_THEME, theme);
    }
  }, [theme]);

  return { isAppLoading, setIsAppLoading, theme, setTheme };
};

export const useAppContext = () => useContext(AppContext);
