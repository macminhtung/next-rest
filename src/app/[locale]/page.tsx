import { getTranslations } from 'next-intl/server';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { Hydration } from '@/react-query/Hydration';
import axios from 'axios';
import type { TRequestConfig, TGetPaginatedRecords } from '@/react-query/types';
import { Products } from '@/app/[locale]/products';
import { DEFAULT_TAKE } from '@/common/constants';

type TSearchParams = Promise<{ page?: number; take?: number; keySearch?: string }>;

const LandingPage = async ({ searchParams }: { searchParams: TSearchParams }) => {
  const t = await getTranslations();
  const { page = 1, take = DEFAULT_TAKE, keySearch = '' } = await searchParams;

  const queryClient = new QueryClient();

  const queryConfig: TRequestConfig<TGetPaginatedRecords> = {
    params: { page, take, keySearch },
  };

  await queryClient.prefetchQuery({
    queryKey: ['GetPaginatedProducts', queryConfig],
    queryFn: () =>
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/product/paginated`, queryConfig)
        .then((res) => res.data)
        .catch((error) => new Error(error.message)),
  });

  return (
    <div className='flex flex-col h-full'>
      <h1 className='text-3xl my-5 md:text-4xl font-semibold text-shadow-neon uppercase'>
        {t('landingPage')}
      </h1>
      <Hydration state={dehydrate(queryClient, { shouldDehydrateQuery: () => true })}>
        <Products queryConfig={queryConfig} />
      </Hydration>
    </div>
  );
};

export default LandingPage;
