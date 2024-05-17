'use client';

import { signOut, useSession } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();

  const handleClick = () => signOut();

  return (
    <div className='flex flex-col justify-center items-center gap-4 w-full h-full'>
      <h1>Hello, <strong>{session?.user?.name}</strong>!</h1>
      <button
        type='button'
        onClick={handleClick}
        className='border p-2 w-60 font-bold hover:bg-neutral-500 active:bg-neutral-700 rounded'
      >Logout</button>
    </div>
  );
}