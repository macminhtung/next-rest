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
import { useSignUpMutation } from '@/react-query/auth';

const signUpSchema = z
  .object({
    email: z.string().email(),
    avatar: z.string().nullable().optional(),
    password: z
      .string()
      .min(6, { message: 'Minimum 6 characters' })
      .max(20, { message: 'Maximum 20 characters' }),
    confirmPassword: z.string(),
    firstName: z
      .string()
      .min(1, { message: 'Minimum 1 characters' })
      .max(10, { message: 'Maximum 10 characters' }),
    lastName: z
      .string()
      .min(1, { message: 'Minimum 1 characters' })
      .max(10, { message: 'Maximum 10 characters' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const SignUpForm = () => {
  const t = useTranslations();
  const curLocale = useLocale();
  const router = useRouter();

  const { Form, ItemField } = useZodForm({
    schema: signUpSchema,
    defaultValues: {
      email: '',
      avatar: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    },
  });

  const signUpMutation = useSignUpMutation({
    onSuccess: () => router.push(`/${curLocale}/signin`),
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof signUpSchema>) => {
      const { avatar, confirmPassword: _, ...rest } = values;
      signUpMutation.mutate({ avatar: avatar || '', ...rest });
    },
    [signUpMutation]
  );

  return (
    <Form onSubmit={onSubmit} className='grid gap-6 w-full max-w-[20rem]'>
      <ItemField
        className='flex items-center'
        iType={EItemFieldType.UPLOAD_IMAGE}
        label={''}
        fieldName='avatar'
      />
      <ItemField iType={EItemFieldType.INPUT} label={t('email')} fieldName='email' />
      <ItemField iType={EItemFieldType.PASSWORD} label={t('password')} fieldName='password' />
      <ItemField
        iType={EItemFieldType.PASSWORD}
        label={t('confirmPassword')}
        fieldName='confirmPassword'
      />
      <ItemField iType={EItemFieldType.INPUT} label={t('firstName')} fieldName='firstName' />
      <ItemField iType={EItemFieldType.INPUT} label={t('lastName')} fieldName='lastName' />
      <ButtonC type='submit' loading={signUpMutation.isPending}>
        {t('submit')}
      </ButtonC>
      <div className='text-center'>
        <span>{t('Already have an account?')}</span>
        <Link href={`/${curLocale}/signin`} className='font-bold text-xl ml-5 underline'>
          {t('signIn')}
        </Link>
      </div>
    </Form>
  );
};

export default SignUpForm;
