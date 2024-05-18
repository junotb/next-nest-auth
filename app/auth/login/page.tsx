'use client';

import Header from '@/components/Header';
import LoginForm from '@/components/LoginForm';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    // 세션이 있으면 메인 페이지로 이동
    if (session) {
      router.push('/');
    }
  }, [session, router]);

  return (
    <div className='flex flex-col gap-4 w-full h-full bg-white dark:bg-black'>
      <Header />
      <div className='flex flex-col gap-4 justify-center items-center w-full h-full'>
        <div className='flex flex-col gap-4 w-full max-w-xs'>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}