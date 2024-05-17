'use client';

import SignUpAlert from '@/components/SignUpAlert';
import SignUpForm from '@/components/SignUpForm';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('error'); // Parameter from /api/auth/error redirect

  useEffect(() => {
    // 세션이 있으면 메인 페이지로 이동
    if (session) {
      router.push('/');
    }
  }, [session, router]);

  return (
    <div className='flex flex-col gap-4 justify-center items-center w-full h-full'>
      { message && <SignUpAlert message={message} />}
      <div className='flex flex-col gap-4 border p-4 w-full max-w-xs text-sm rounded'>
        <SignUpForm />
      </div>
    </div>
  );
}