import { useTranslations } from 'next-intl';
import SignUpForm from '@/app/[locale]/signup/form';

const SignUpPage = () => {
  const t = useTranslations();

  return (
    <div className='size-full flex flex-col items-center gap-6'>
      <p className='text-3xl md:text-5xl font-bold my-5 md:my-10'>{t('signUp')}</p>
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
