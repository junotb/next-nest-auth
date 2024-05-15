'use client';

import LoginAlert from '@/components/LoginAlert';
import LoginForm from '@/components/LoginForm';
import SignUpModal from '@/components/SignUpModal';
import SocialLoginButtons from '@/components/SocialLoginButtons';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('error'); // Parameter from /api/auth/error redirect

  const handleIsSignUp = () => setIsSignUp(!isSignUp);

  useEffect(() => {
    // 세션이 있으면 메인 페이지로 이동
    if (session) {
      router.push('/');
    }
  }, [session, router]);

  return (
    <div className='flex flex-col gap-4 justify-center items-center w-full h-full'>
      { message && <LoginAlert message={message} />}
      <div className='flex flex-col gap-4 border p-4 w-full max-w-xs text-sm rounded'>
        <LoginForm />
        <SocialLoginButtons />
        <div className='flex justify-center'>
          <p>New to Here?</p>&nbsp;
          <button
            type='button'
            onClick={handleIsSignUp}
            className='font-bold text-neutral-500 hover:text-neutral-700'
          >Create an account</button>
        </div>
      </div>
      { isSignUp && <SignUpModal handleIsSignUp={handleIsSignUp} /> }
    </div>
  );
}