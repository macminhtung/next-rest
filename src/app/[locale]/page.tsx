import Link from 'next/link';
import { useTranslations } from 'next-intl';

const LandingPage = () => {
  const t = useTranslations();

  return (
    <div className='flex flex-col h-full items-center justify-center'>
      <h1 className='text-5xl font-semibold my-28'>LANDING PAGE</h1>
      <Link className='text-3xl underline font-semibold' href='/product'>
        {t('product')}
      </Link>
    </div>
  );
};

export default LandingPage;
