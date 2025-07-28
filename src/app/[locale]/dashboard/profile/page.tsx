import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPen, KeySquare } from 'lucide-react';
import ProfileForm from '@/app/[locale]/dashboard/profile/profile-form';
import PasswordForm from '@/app/[locale]/dashboard/profile/password-form';

const ProfilePage = () => {
  const t = useTranslations();

  const tabs = useMemo(
    () => [
      {
        icon: UserPen,
        name: t('profile'),
        content: (
          <>
            <p className='text-4xl font-bold my-10'>{t('profile')}</p>
            <ProfileForm />
          </>
        ),
      },
      {
        icon: KeySquare,
        name: t('password'),
        content: (
          <>
            <p className='text-4xl font-bold my-10'>{t('password')}</p>
            <PasswordForm />
          </>
        ),
      },
    ],
    [t]
  );

  return (
    <div className='size-full flex flex-col items-center gap-6'>
      <Tabs
        defaultValue={tabs[0].name}
        className='w-full flex flex-row items-start gap-4 justify-center max-md:flex-col max-md:items-center'
      >
        <TabsList className='shrink-0 grid grid-cols-1 p-0 max-md:grid-cols-2 bg-background'>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.name}
              value={tab.name}
              className='border-l-[5px] border-transparent rounded-md justify-start data-[state=active]:shadow-none data-[state=active]:border-primary data-[state=active]:bg-primary/5 py-1.5 max-md:border-l-1 max-md:border-b-[3px]'
            >
              <tab.icon className='h-5 w-5 me-2' /> {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className='flex items-center justify-center w-full'>
          {tabs.map((tab) => (
            <TabsContent
              key={tab.name}
              value={tab.name}
              className='flex flex-col items-center justify-center'
            >
              {tab.content}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
