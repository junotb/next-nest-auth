'use client';

import Header from '@/components/Header';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
  const { data: session, status } = useSession();

  const handleClick = () => signOut();

  return (
    <div className='flex flex-col justify-center items-center gap-4 w-full h-full bg-white dark:bg-black'>
      <div className='flex flex-col gap-4 w-96'>
        <Header />
        <h1 className='text-black dark:text-white'><strong>{session?.user?.name}</strong>님, 안녕하세요!</h1>
        <div className='flex gap-4'>
          <Link
            href='/auth/profile'
            className='border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white p-2 w-full font-bold hover:bg-neutral-300 dark:hover:bg-neutral-500 active:bg-neutral-500 dark:active:bg-neutral-300 text-center rounded'
          >회원정보</Link>
          <button
            type='button'
            onClick={handleClick}
            className='border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white p-2 w-full font-bold hover:bg-neutral-300 dark:hover:bg-neutral-500 active:bg-neutral-500 dark:active:bg-neutral-300 text-center rounded'
          >로그아웃</button>
        </div>
      </div>
    </div>
  );
}