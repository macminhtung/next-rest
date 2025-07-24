'use client';

import { useCallback, useState, useEffect } from 'react';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { useZodForm } from '@/components/form/hooks';
import { EItemFieldType } from '@/components/form/enums';
import { ButtonC } from '@/components/ui-customize';
import { useSignInMutation } from '@/react-query/auth';
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
  const [mounted, setMounted] = useState(false);
  const setAccessToken = useAppStore((state) => state.setAccessToken);
  const { Form, ItemField } = useZodForm({
    schema: signInSchema,
    defaultValues: { email: '', password: '' },
  });

  const signInMutation = useSignInMutation({
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      manageAccessToken({ type: EManageTokenType.SET, accessToken: data.accessToken });
    },
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof signInSchema>) => {
      signInMutation.mutateAsync(values);
    },
    [signInMutation]
  );

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <Form onSubmit={onSubmit} className='grid gap-6 w-full max-w-[20rem]'>
      <ItemField iType={EItemFieldType.INPUT} label={t('email')} fieldName='email' />
      <ItemField iType={EItemFieldType.PASSWORD} label={t('password')} fieldName='password' />
      <ButtonC type='submit' loading={signInMutation.isPending}>
        {t('submit')}
      </ButtonC>
    </Form>
  );
};

export default SignInForm;
