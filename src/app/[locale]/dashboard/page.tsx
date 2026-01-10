import Link from 'next/link';
import { useTranslations } from 'next-intl';

const DashboardPage = () => {
  const t = useTranslations();

  return (
    <div className='flex flex-col h-full'>
      <h1 className='text-3xl my-5 md:text-4xl font-semibold text-shadow-neon'>DASHBOARD PAGE</h1>
      <Link
        className='text-xl md:text-3xl underline font-semibold'
        href='/dashboard/product-management'
      >
        {t('productManagement')}
      </Link>
    </div>
  );
};

export default DashboardPage;
