'use client';

import LoginForm from '@/components/LoginForm';
import SocialLoginButtons from '@/components/SocialLoginButtons';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
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
    <div className="flex flex-col gap-4 justify-center w-96">
      <LoginForm />
      <SocialLoginButtons />
      <div className='flex justify-center'>
        <p className='text-black dark:text-white'>처음이신가요?</p>&nbsp;
        <Link
          href='/auth/signup'
          className='font-bold border-black dark:border-white text-neutral-300 dark:text-neutral-500 hover:text-neutral-500 dark:hover:text-neutral-300'
        >회원가입</Link>
      </div>
    </div>
  );
}