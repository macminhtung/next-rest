import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
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
        SignIn
      </Link>
    </div>
  );
}
