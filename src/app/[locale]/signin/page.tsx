import SignInForm from '@/app/[locale]/signin/form';
import { useTranslations } from 'next-intl';

const SignInPage = () => {
  const t = useTranslations();

  return (
    <div className='size-full flex flex-col items-center gap-6'>
      <p className='text-4xl font-bold mb-10'>{t('signIn')}</p>
      <SignInForm />
    </div>
  );
};

export default SignInPage;
