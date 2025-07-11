'use client';

import { useCallback } from 'react';
import { z } from 'zod';
import { useZodForm } from '@/components/form/hooks';
import { EItemFieldType } from '@/components/form/enums';
import { ButtonC } from '@/components/ui-customize';

const signInSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: 'Minimum 6 characters' })
    .max(20, { message: 'Maximum 20 characters' }),
});

const SignInForm = () => {
  const { Form, ItemField } = useZodForm({
    schema: signInSchema,
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = useCallback((values: z.infer<typeof signInSchema>) => console.log(values), []);

  return (
    <Form onSubmit={onSubmit} className='grid gap-6 w-full max-w-[20rem]'>
      <ItemField iType={EItemFieldType.INPUT} label='Username' fieldName='email' />
      <ItemField iType={EItemFieldType.PASSWORD} label='Password' fieldName='password' />
      <ButtonC type='submit'>Submit</ButtonC>
    </Form>
  );
};

export default SignInForm;
