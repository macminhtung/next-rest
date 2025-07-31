'use client';

import { DetailedHTMLProps, FormHTMLAttributes, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { DefaultValues, FieldValues, UseFormProps } from 'react-hook-form';
import { FormProvider } from '@/components/ui';
import { FormFieldC, TItemFieldC } from '@/components/form';
import type { ZodSchema } from 'zod';

type TFormProps<T extends FieldValues> = Omit<
  DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>,
  'onSubmit'
> & { onSubmit: (v: T) => void };

type TUseZodForm<T extends FieldValues> = UseFormProps<T> & {
  schema: ZodSchema<T>;
  defaultValues?: DefaultValues<T>;
  values: T;
};

export const useZodForm = <T extends FieldValues>(props: TUseZodForm<T>) => {
  const { schema, mode = 'onBlur', ...rest } = props;
  const methods = useForm<T, unknown, T>({ resolver: zodResolver(schema), mode, ...rest });

  const ItemField = useCallback(
    (props: TItemFieldC<T>) => FormFieldC({ ...props, control: methods.control }),
    [methods.control]
  );

  const Form = useCallback(
    ({ onSubmit, ...rest }: TFormProps<T>) => (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} {...rest} />
      </FormProvider>
    ),
    [methods]
  );

  return { methods, Form, ItemField };
};
