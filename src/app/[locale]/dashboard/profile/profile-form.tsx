'use client';

import { useCallback } from 'react';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { useZodForm } from '@/components/form/hooks';
import { EItemFieldType } from '@/components/form/enums';
import { ButtonC } from '@/components/ui-customize';
import { useAppStore } from '@/store';
import { useUpdateProfileMutation } from '@/react-query/auth';
import { showToastSuccess } from '@/common/client-funcs';

const profileSchema = z.object({
  avatar: z.string().optional(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
});

const ProfileForm = () => {
  const t = useTranslations();
  const authUser = useAppStore((state) => state.authUser);

  const setAuthUser = useAppStore((state) => state.setAuthUser);

  const { methods, Form, ItemField } = useZodForm({
    schema: profileSchema,
    values: authUser,
  });

  const updateProfileMutation = useUpdateProfileMutation({
    onSuccess: (data) => {
      setAuthUser({ ...authUser, ...data });
      showToastSuccess(t('updatedSuccessfully'));
    },
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof profileSchema>) => {
      const { email: _, ...rest } = values;
      updateProfileMutation.mutate(rest);
    },
    [updateProfileMutation]
  );

  return (
    <Form onSubmit={onSubmit} className='grid gap-6 w-full max-w-[20rem]'>
      <ItemField
        className='flex items-center'
        iType={EItemFieldType.UPLOAD_IMAGE}
        label={''}
        fieldName='avatar'
      />
      <ItemField
        iType={EItemFieldType.INPUT}
        label={t('email')}
        fieldName='email'
        iProps={{ disabled: true }}
      />
      <ItemField iType={EItemFieldType.INPUT} label={t('firstName')} fieldName='firstName' />
      <ItemField iType={EItemFieldType.INPUT} label={t('lastName')} fieldName='lastName' />
      <ButtonC
        type='submit'
        loading={updateProfileMutation.isPending}
        disabled={!methods.formState.isDirty}
      >
        {t('submit')}
      </ButtonC>
    </Form>
  );
};

export default ProfileForm;
