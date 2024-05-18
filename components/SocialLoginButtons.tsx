'use client';

import { signIn } from "next-auth/react";
import Image from "next/image";

export default function SocialLoginButtons() {
  const handleClick = (provider: string) => signIn(provider);

  return (
    <div className='flex gap-4 justify-center'>
      <button
        onClick={() => handleClick('kakao')}
        className='flex justify-center items-center w-12 h-12 border border-black dark:border-white bg-white hover:bg-neutral-300 active:bg-neutral-500 dark:hover:bg-neutral-500 dark:active:bg-neutral-300 rounded-full'
      >
        <Image src='/images/icon-kakao.svg' width={32} height={32} alt='Kakao Login' />
      </button>
      <button
        onClick={() => handleClick('naver')}
        className='flex justify-center items-center w-12 h-12 border border-black dark:border-white bg-white hover:bg-neutral-300 active:bg-neutral-500 dark:hover:bg-neutral-500 dark:active:bg-neutral-300 rounded-full'
      >
        <Image src='/images/icon-naver.svg' width={20} height={20} alt='Naver Login' />
      </button>
      <button
        onClick={() => handleClick('google')}
        className='flex justify-center items-center w-12 h-12 border border-black dark:border-white bg-white hover:bg-neutral-300 active:bg-neutral-500 dark:hover:bg-neutral-500 dark:active:bg-neutral-300 rounded-full'
      >
        <Image src='/images/icon-google.svg' width={28} height={28} alt='Google Login' />
      </button>
      <button
        onClick={() => handleClick('facebook')}
        className='flex justify-center items-center w-12 h-12 border border-black dark:border-white bg-white hover:bg-neutral-300 active:bg-neutral-500 dark:hover:bg-neutral-500 dark:active:bg-neutral-300 rounded-full'
      >
        <Image src='/images/icon-facebook.svg' width={20} height={20} alt='Facebook Login' />
      </button>
    </div>
  );
}