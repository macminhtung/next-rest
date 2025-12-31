import { getTranslations } from 'next-intl/server';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { Hydration } from '@/react-query/Hydration';
import axios from 'axios';
import type { TRequestConfig, TGetPaginatedRecords } from '@/react-query/types';
import { Products } from '@/app/[locale]/product/products';

const ProductPage = async () => {
  const t = await getTranslations();

  const queryClient = new QueryClient();
  const queryConfig: TRequestConfig<TGetPaginatedRecords> = { params: { page: 1, take: 10 } };
  await queryClient.prefetchQuery({
    queryKey: ['GetPaginatedProducts', queryConfig],
    queryFn: () =>
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/product/paginated`, queryConfig)
        .then((res) => res.data)
        .catch((error) => new Error(error.message)),
  });

  return (
    <div className='flex flex-col size-full'>
      <p className='text-3xl md:text-4xl font-semibold my-4 text-shadow-neon'>{t('product')}</p>
      <Hydration state={dehydrate(queryClient, { shouldDehydrateQuery: () => true })}>
        <Products queryConfig={queryConfig} />
      </Hydration>
    </div>
  );
};

export default ProductPage;
