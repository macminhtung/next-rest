import { Suspense } from 'react';
import SignInForm from '@/app/signin/form';
import { Loader2 } from 'lucide-react';

const SignInPage = () => {
  return (
    <div className='size-full flex flex-col items-center gap-6'>
      <p className='text-4xl font-bold mb-10'>SignIn</p>
      <Suspense fallback={<Loader2 className='animate-spin' />}>
        <SignInForm />
      </Suspense>
    </div>
  );
};

export default SignInPage;
