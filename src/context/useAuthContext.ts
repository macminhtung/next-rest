import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { createContext, useContextSelector } from 'use-context-selector';
import { manageTokens, EManageTokenType } from '@/common/funcs';

interface IAuthUser {
  avatar: string;
  email: string;
  firstName: string;
  lastName: string;
}

const initAuthUser: IAuthUser = {
  avatar: '',
  email: '',
  firstName: '',
  lastName: '',
};

interface IAuthContext {
  tokens: { accessToken: string; refreshToken: string };
  setTokens: Dispatch<SetStateAction<{ accessToken: string; refreshToken: string }>>;
  authUser: IAuthUser;
  setAuthUser: Dispatch<SetStateAction<IAuthUser>>;
}

const initValues: IAuthContext = {
  tokens: manageTokens({ type: EManageTokenType.GET }),
  setTokens: () => null,
  authUser: initAuthUser,
  setAuthUser: () => initAuthUser,
};

export const AuthContext = createContext<IAuthContext>(initValues);

export const useAuthContextValue = (): IAuthContext => {
  const [tokens, setTokens] = useState<IAuthContext['tokens']>(initValues.tokens);
  const [authUser, setAuthUser] = useState<IAuthContext['authUser']>(initValues.authUser);

  return {
    tokens,
    setTokens,
    authUser,
    setAuthUser,
  };
};

export const useAuthSelector = <T>(selector: (ctx: IAuthContext) => T): T =>
  useContextSelector(AuthContext, selector);
