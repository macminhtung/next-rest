import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations();

  return (
    <div className='flex flex-col h-full items-center justify-center'>
      <Image
        className='dark:invert animate-bounce'
        src='/next.svg'
        alt='Next.js logo'
        width={300}
        height={100}
        priority
      />
      <Link href={'/signin'} className='mt-10 text-3xl font-bold underline'>
        {t('signIn')}
      </Link>
    </div>
  );
}
