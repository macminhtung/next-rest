'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useZodForm } from '@/components/form/hooks';
import { EItemFieldType } from '@/components/form/enums';
import { ButtonC } from '@/components/ui-customize';
import { useSignInMutation } from '@/react-query/auth';
import { AppLoading } from '@/components/AppLoading';
import { useAppStore } from '@/store';
import { manageAccessToken, EManageTokenType } from '@/common/client-funcs';

const signInSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: 'Minimum 6 characters' })
    .max(20, { message: 'Maximum 20 characters' }),
});

const SignInForm = () => {
  const t = useTranslations();
  const curLocale = useLocale();
  const router = useRouter();
  const setAccessToken = useAppStore((state) => state.setAccessToken);
  const accessToken = useAppStore((state) => state.accessToken);

  const { Form, ItemField } = useZodForm({
    schema: signInSchema,
    values: { email: '', password: '' },
  });

  const signInMutation = useSignInMutation({
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      manageAccessToken({ type: EManageTokenType.SET, accessToken: data.accessToken });
      router.push(`/${curLocale}/dashboard`);
    },
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof signInSchema>) => {
      signInMutation.mutate(values);
    },
    [signInMutation]
  );

  if (accessToken) return <AppLoading />;

  return (
    <Form onSubmit={onSubmit} className='grid gap-6 w-full max-w-[20rem]'>
      <ItemField iType={EItemFieldType.INPUT} label={t('email')} fieldName='email' />
      <ItemField iType={EItemFieldType.PASSWORD} label={t('password')} fieldName='password' />
      <ButtonC type='submit' loading={signInMutation.isPending}>
        {t('submit')}
      </ButtonC>
      <div className='text-center'>
        <span>{t("Don't have an account?")}</span>
        <Link href={`/${curLocale}/signup`} className='ml-5 font-bold text-xl underline'>
          {t('signUp')}
        </Link>
      </div>
    </Form>
  );
};

export default SignInForm;
