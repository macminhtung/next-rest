'use client';

import { useCallback } from 'react';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { useZodForm } from '@/components/form/hooks';
import { EItemFieldType } from '@/components/form/enums';
import { ButtonC } from '@/components/ui-customize';
import { useUpdatePasswordMutation } from '@/react-query/auth';
import { useAppStore } from '@/store';
import { manageAccessToken, EManageTokenType, showToastSuccess } from '@/common/client-funcs';

const changePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(6, { message: 'Minimum 6 characters' })
      .max(20, { message: 'Maximum 20 characters' }),
    newPassword: z
      .string()
      .min(6, { message: 'Minimum 6 characters' })
      .max(20, { message: 'Maximum 20 characters' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const PasswordForm = () => {
  const t = useTranslations();
  const setAccessToken = useAppStore((state) => state.setAccessToken);

  const { methods, Form, ItemField } = useZodForm({
    schema: changePasswordSchema,
    values: { oldPassword: '', newPassword: '', confirmPassword: '' },
  });

  const updateProfileMutation = useUpdatePasswordMutation({
    onSuccess: (data) => {
      methods.reset();
      setAccessToken(data.accessToken);
      manageAccessToken({ type: EManageTokenType.SET, accessToken: data.accessToken });
      showToastSuccess(t('updatedSuccessfully'));
    },
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof changePasswordSchema>) => {
      updateProfileMutation.mutate(values);
    },
    [updateProfileMutation]
  );

  return (
    <Form onSubmit={onSubmit} className='grid gap-6 w-full max-w-[20rem]'>
      <ItemField
        iType={EItemFieldType.PASSWORD}
        label={t('currentPassword')}
        fieldName='oldPassword'
      />
      <ItemField iType={EItemFieldType.PASSWORD} label={t('newPassword')} fieldName='newPassword' />
      <ItemField
        iType={EItemFieldType.PASSWORD}
        label={t('confirmPassword')}
        fieldName='confirmPassword'
      />
      <ButtonC type='submit' loading={updateProfileMutation.isPending}>
        {t('submit')}
      </ButtonC>
    </Form>
  );
};

export default PasswordForm;
