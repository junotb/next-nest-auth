'use client';

import { signIn } from 'next-auth/react';
import { FormEvent, useRef, useState } from 'react';

export default function SignUpForm() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;
    const confirm = confirmRef.current?.value;

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: username, password: password, confirm: confirm })
    });

    if (!response.ok) {
      const data = await response.json();
      setErrorMessage(data.error);
      return;
    }

    signIn('credentials', { username, password });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col gap-4 justify-center m-4'
    >
      <div className='flex justify-between items-center gap-2'>
        <label className='text-lg font-bold' htmlFor='username'>Username</label>
        <input
          type='text'
          ref={usernameRef}
          className='p-2 text-black bg-white hover:bg-neutral-300 focus:bg-neutral-300 outline-none rounded'
          placeholder='Enter Username' />
      </div>
      <div className='flex justify-between items-center gap-2'>
        <label className='text-lg font-bold' htmlFor='password'>Password</label>
        <input
          type='password'
          ref={passwordRef}
          className='p-2 text-black bg-white hover:bg-neutral-300 focus:bg-neutral-300 outline-none rounded'
          placeholder='Enter Password' />
      </div>
      <div className='flex justify-between items-center gap-2'>
        <label className='text-lg font-bold' htmlFor='password'>Confirm</label>
        <input
          type='password'
          ref={confirmRef}
          className='p-2 text-black bg-white hover:bg-neutral-300 focus:bg-neutral-300 outline-none rounded'
          placeholder='Confirm Password' />
      </div>
      <button className='border p-2 font-bold hover:bg-neutral-500 active:bg-neutral-700 rounded'>Submit</button>
      { errorMessage && <p className='text-right'>{errorMessage}</p> }
    </form>
  );
}