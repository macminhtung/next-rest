import Link from 'next/link';
import { useTranslations } from 'next-intl';

const LandingPage = () => {
  const t = useTranslations();

  return (
    <div className='flex flex-col h-full'>
      <h1 className='text-3xl my-5 md:text-5xl md:my-10 font-semibold'>LANDING PAGE</h1>
      <Link className='text-xl md:text-3xl underline font-semibold' href='/product'>
        {t('product')}
      </Link>
    </div>
  );
};

export default LandingPage;
