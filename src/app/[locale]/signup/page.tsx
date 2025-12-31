import { useTranslations } from 'next-intl';
import SignUpForm from '@/app/[locale]/signup/form';

const SignUpPage = () => {
  const t = useTranslations();

  return (
    <div className='size-full flex flex-col items-center gap-6'>
      <p className='text-3xl md:text-4xl font-bold my-5 text-shadow-neon'>{t('signUp')}</p>
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
