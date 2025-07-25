'use client';

import { useCallback } from 'react';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { useZodForm } from '@/components/form/hooks';
import { EItemFieldType } from '@/components/form/enums';
import { ButtonC } from '@/components/ui-customize';
import { useAppStore } from '@/store';

const profileSchema = z.object({
  avatar: z.string().nullable().optional(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
});

const ProfileForm = () => {
  const t = useTranslations();
  const { avatar, email, firstName, lastName } = useAppStore((state) => state.authUser);

  const { Form, ItemField } = useZodForm({
    schema: profileSchema,
    defaultValues: { avatar, email, firstName, lastName },
  });

  const onSubmit = useCallback((values: z.infer<typeof profileSchema>) => {
    console.log(values);
  }, []);

  return (
    <Form onSubmit={onSubmit} className='grid gap-6 w-full max-w-[20rem]'>
      <ItemField
        className='flex items-center'
        iType={EItemFieldType.UPLOAD_IMAGE}
        label={''}
        fieldName='avatar'
      />
      <ItemField iType={EItemFieldType.INPUT} label={t('email')} fieldName='email' />
      <ItemField iType={EItemFieldType.INPUT} label={t('firstName')} fieldName='firstName' />
      <ItemField iType={EItemFieldType.INPUT} label={t('lastName')} fieldName='lastName' />
      <ButtonC type='submit'>{t('submit')}</ButtonC>
    </Form>
  );
};

export default ProfileForm;
