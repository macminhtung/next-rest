import { useTranslations } from 'next-intl';
import SignInForm from '@/app/[locale]/signin/form';

const SignInPage = () => {
  const t = useTranslations();

  return (
    <div className='size-full flex flex-col items-center gap-6'>
      <p className='text-3xl md:text-5xl font-bold my-5 md:my-10'>{t('signIn')}</p>
      <SignInForm />
    </div>
  );
};

export default SignInPage;
