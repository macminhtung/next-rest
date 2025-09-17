import { getTranslations } from 'next-intl/server';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { Hydration } from '@/react-query/Hydration';
import axios from 'axios';
import type { TRequestConfig, TGetPaginatedRecords } from '@/react-query/types';
import { Products } from '@/app/[locale]/product/products';

const ProductPage = async () => {
  const t = await getTranslations();

  const queryClient = new QueryClient();
  const queryConfig: TRequestConfig<TGetPaginatedRecords> = { params: { page: 1, take: 5 } };
  await queryClient.prefetchQuery({
    queryKey: ['useGetPaginatedProductsQuery', queryConfig],
    queryFn: () =>
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/product/paginated`, queryConfig)
        .then((res) => res.data)
        .catch((error) => new Error(error.message)),
  });

  return (
    <div className='flex flex-col h-full w-full items-center justify-center'>
      <h1 className='text-5xl font-semibold my-10'>{t('product')}</h1>
      <Hydration state={dehydrate(queryClient, { shouldDehydrateQuery: () => true })}>
        <Products queryConfig={queryConfig} />
      </Hydration>
    </div>
  );
};

export default ProductPage;
