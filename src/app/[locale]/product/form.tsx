'use client';

import { useCallback } from 'react';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useZodForm } from '@/components/form/hooks';
import { EItemFieldType } from '@/components/form/enums';
import { ButtonC } from '@/components/ui-customize';
import {
  TProduct,
  useCreateProductMutation,
  useUpdateProductMutation,
} from '@/react-query/product';

const formSchema = z.object({
  image: z.string(),
  name: z.string(),
  description: z.string(),
});

type TProductForm = { formValues: TProduct; closeDialog: () => void };

const ProductForm = (props: TProductForm) => {
  const { formValues, closeDialog } = props;
  const t = useTranslations();
  const queryClient = useQueryClient();

  const { Form, ItemField } = useZodForm({
    schema: formSchema,
    values: formValues,
  });

  const createProductMutation = useCreateProductMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GetPaginatedProducts'] });
      closeDialog();
    },
  });

  const updateProductMutation = useUpdateProductMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GetPaginatedProducts'] });
      closeDialog();
    },
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      if (!formValues.id) createProductMutation.mutate(values);
      else updateProductMutation.mutate({ ...values, id: formValues.id });
    },
    [createProductMutation, formValues.id, updateProductMutation]
  );

  return (
    <Form onSubmit={onSubmit} className='grid gap-6 w-full'>
      <ItemField
        iType={EItemFieldType.UPLOAD_IMAGE}
        label={''}
        fieldName='image'
        className='items-center'
      />
      <ItemField iType={EItemFieldType.INPUT} label={'Name'} fieldName='name' />
      <ItemField iType={EItemFieldType.TEXTAREA} label={'Description'} fieldName='description' />
      <ButtonC
        type='submit'
        loading={createProductMutation.isPending || updateProductMutation.isPending}
      >
        {t('submit')}
      </ButtonC>
    </Form>
  );
};

export default ProductForm;
