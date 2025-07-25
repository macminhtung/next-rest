import { useTranslations } from 'next-intl';
import ProfileForm from '@/app/[locale]/dashboard/profile/form';

const ProfilePage = () => {
  const t = useTranslations();

  return (
    <div className='size-full flex flex-col items-center gap-6'>
      <p className='text-4xl font-bold mb-10'>{t('profile')}</p>
      <ProfileForm />
    </div>
  );
};

export default ProfilePage;
