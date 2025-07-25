import { useTranslations } from 'next-intl';
import SignUpForm from '@/app/[locale]/signup/form';

const SignUpPage = () => {
  const t = useTranslations();

  return (
    <div className='size-full flex flex-col items-center gap-6'>
      <p className='text-4xl font-bold mb-10'>{t('signUp')}</p>
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
