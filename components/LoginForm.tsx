'use client';

import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useRef, useState } from 'react';

export default function LoginForm() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');
  const { data: session } = useSession();
  const router = useRouter();

  const handleClick = (provider: string) => {
    signIn(provider);
  }
  
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    const result = await signIn('credentials', { redirect: false, username: username, password: password });
    if (result?.error) {
      setError('An invalid data');
      return;
    }

    router.push('/');
  }

  useEffect(() => {
    // 세션이 있으면 메인 페이지로 이동
    if (session) {
      router.push('/');
    }
  }, [session, router]);

  return (
    <div className='flex flex-col gap-4 w-full max-w-xs text-sm'>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-4 justify-center'
      >
        <div className='flex justify-between items-center gap-2'>
          <label
            className='font-bold'
            htmlFor='username'
          >Username</label>
          <input
            type='text'
            ref={usernameRef}
            className='p-2 text-black bg-white focus:bg-neutral-300 rounded'
            placeholder='Enter Username' />
        </div>
        <div className='flex justify-between items-center gap-2'>
          <label
            className='font-bold'
            htmlFor='password'
          >Password</label>
          <input
            type='password'
            ref={passwordRef}
            className='p-2 text-black bg-white focus:bg-neutral-300 rounded'
            placeholder='Enter Password' />
        </div>
        { error && <p className='text-right'>{error}</p>}
        <button
          type='submit'
          className='border p-2 font-bold hover:bg-neutral-500 active:bg-neutral-700 rounded'
        >Submit</button>
      </form>
      <div className='flex gap-4 justify-center'>
        <button
          onClick={() => handleClick('facebook')}
          className='flex justify-center items-center w-12 h-12 bg-white hover:bg-neutral-500 rounded-full'
        >
          <Image
            src='/images/icon-facebook.svg'
            width={20}
            height={20}
            alt='Facebook Login'
          />
        </button>
        <button
          onClick={() => handleClick('naver')}
          className='flex justify-center items-center w-12 h-12 bg-white hover:bg-neutral-500 rounded-full'
        >
          <Image
            src='/images/icon-naver.svg'
            width={20}
            height={20}
            alt='Naver Login'
          />
        </button>
        <button
          onClick={() => handleClick('kakao')}
          className='flex justify-center items-center w-12 h-12 bg-white hover:bg-neutral-500 rounded-full'
        >
          <Image
            src='/images/icon-kakao.svg'
            width={20}
            height={20}
            alt='Kakao Login'
          />
        </button>
        <button
          onClick={() => handleClick('google')}
          className='flex justify-center items-center w-12 h-12 bg-white hover:bg-neutral-500 rounded-full'
        >
          <Image
            src='/images/icon-google.svg'
            width={28}
            height={28}
            alt='Google Login'
          />
        </button>
      </div>
    </div>
  );
}