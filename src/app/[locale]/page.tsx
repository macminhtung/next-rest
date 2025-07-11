import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations();

  return (
    <div className='flex flex-col h-full items-center justify-center'>
      <Link href={'/signin'} className='mt-10 text-3xl font-bold underline'>
        {t('signIn')}
      </Link>
    </div>
  );
}
