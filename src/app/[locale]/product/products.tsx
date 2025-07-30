'use client';

import { useState } from 'react';
import { useGetPaginatedProductsQuery } from '@/react-query/product';
import { TableC, AvatarC } from '@/components/ui-customize';
import type { TRequestConfig, TGetPaginatedRecords } from '@/react-query/types';

export const Products = (props: { queryConfig: TRequestConfig<TGetPaginatedRecords> }) => {
  const { queryConfig } = props;
  const [params, setParams] = useState<TGetPaginatedRecords>(queryConfig.params);

  const { data, isLoading } = useGetPaginatedProductsQuery({ params });
  const { records = [], page, total, take } = data! || {};

  if (isLoading) return <p>Loading...</p>;

  return (
    <TableC
      headers={[
        {
          key: 'image',
          title: 'Image',
          render: (record) => <AvatarC src={record.image} className='rounded-none size-[50px]' />,
        },
        { key: 'name', title: 'Name' },
        { key: 'description', title: 'Description' },
      ]}
      className='[&>div]:max-h-[300px]'
      rowKey='name'
      rowRecords={records}
      pagination={{ page, total, take, setPagination: setParams }}
    />
  );
};
