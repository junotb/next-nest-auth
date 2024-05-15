'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  let message = '알 수 없는 오류가 발생했습니다.';
  if (error === 'CredentialsSignin') {
    message = '아이디 또는 비밀번호가 잘못되었습니다.';
  } else if (error === 'OAuthSignin') {
    message = '소셜 로그인에 실패했습니다.';
  }

  return (
    <div className='flex flex-col justify-center items-center w-full h-full'>
      <Image
        src='/images/icon-exclamation-circle.svg'
        width={36}
        height={36}
        className='animate-ping'
        alt='Redirecting to login page...'
      />
    </div>
  );
}