'use client';

import Header from '@/components/Header';
import { signOut, useSession } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();

  const handleClick = () => signOut();

  return (
    <div className='flex flex-col gap-4 w-full h-full bg-white dark:bg-black'>
      <Header />
      <div className='flex flex-col gap-4 justify-center items-center w-full h-full'>
        <h1 className='text-black dark:text-white'><strong>{session?.user?.name}</strong>님, 안녕하세요!</h1>
        <button
          type='button'
          onClick={handleClick}
          className='border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white p-2 w-60 font-bold hover:bg-neutral-300 dark:hover:bg-neutral-500 active:bg-neutral-500 dark:active:bg-neutral-300 rounded'
        >Logout</button>
      </div>
    </div>
  );
}