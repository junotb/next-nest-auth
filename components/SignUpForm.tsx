'use client';

import { signIn } from 'next-auth/react';
import { FormEvent, useRef, useState } from 'react';

export default function SignUpForm() {
  const nameRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const name = nameRef.current?.value;
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        username: username,
        password: password
      })
    });

    if (!response.ok) {
      const data = await response.json();
      setErrorMessage(data.error);
      return;
    }

    signIn('credentials', { username, password });
  }

  return (
    <>
      { errorMessage && SignUpAlert(errorMessage) }
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-4 justify-center border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white p-4 rounded'
      >
        <div className='flex justify-between items-center gap-2'>
          <label className='font-bold' htmlFor='username'>이름</label>
          <input
            type='text'
            ref={nameRef}
            className='p-2 w-52 border border-black dark:border-white text-black dark:text-white bg-white dark:bg-black hover:bg-neutral-300 dark:hover:bg-neutral-500 focus:bg-neutral-300 dark:focus:bg-neutral-500 placeholder:text-neutral-500 dark:placeholder:text-neutral-300 outline-none rounded'
            placeholder='이름을 입력해주세요' />
        </div>
        <div className='flex justify-between items-center gap-2'>
          <label className='font-bold' htmlFor='username'>아이디</label>
          <input
            type='text'
            ref={usernameRef}
            className='p-2 w-52 border border-black dark:border-white text-black dark:text-white bg-white dark:bg-black hover:bg-neutral-300 dark:hover:bg-neutral-500 focus:bg-neutral-300 dark:focus:bg-neutral-500 placeholder:text-neutral-500 dark:placeholder:text-neutral-300 outline-none rounded'
            placeholder='아이디를 입력해주세요' />
        </div>
        <div className='flex justify-between items-center gap-2'>
          <label className='font-bold' htmlFor='password'>비밀번호</label>
          <input
            type='password'
            ref={passwordRef}
            className='p-2 w-52 border border-black dark:border-white text-black dark:text-white bg-white dark:bg-black hover:bg-neutral-300 dark:hover:bg-neutral-500 focus:bg-neutral-300 dark:focus:bg-neutral-500 placeholder:text-neutral-500 dark:placeholder:text-neutral-300 outline-none rounded'
            placeholder='비밀번호를 입력해주세요' />
        </div>
        <button className='border border-black dark:border-white p-2 font-bold hover:bg-neutral-300 active:bg-neutral-500 dark:hover:bg-neutral-500 dark:active:bg-neutral-300 rounded'>회원가입</button>
      </form>
    </>
  );
}

const SignUpAlert = (errorMessage: string) => {
  return (
    <div
      className='border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white p-4 w-full rounded'
      role='alert'
    >
      <p className='text-black'>{errorMessage}</p>
    </div>
  );
}