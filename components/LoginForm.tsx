'use client';

import { signIn } from "next-auth/react";
import { FormEvent, useRef, useState } from "react";
import SocialLoginButtons from "./SocialLoginButtons";
import Link from "next/link";

export default function LoginForm() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    const response = await signIn('credentials', { redirect: false, username, password });
    
    if (response && !response.ok) {
      let errorMessage = '';
      if (response.error === 'CredentialsSignin') {
        errorMessage = '아이디 또는 비밀번호가 잘못되었습니다. 다시 확인해 주세요.';
      } else if (response.error === 'OAuthSignin') {
        errorMessage = '소셜 로그인에 실패했습니다. 다른 계정으로 시도해 보세요.';
      } else {
        errorMessage = '알 수 없는 오류로 로그인에 실패했습니다. 다시 시도해 주세요.';
      }

      setErrorMessage(errorMessage);
      return;
    }
  }

  return (
    <div className="flex flex-col gap-4 justify-center border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white p-4 rounded">
      { errorMessage && LoginAlert(errorMessage) }
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-4 justify-center rounded'
      >
        <div className='flex justify-between items-center gap-2'>
          <label className='font-bold' htmlFor='username'>아이디</label>
          <input
            type='text'
            ref={usernameRef}
            className='p-2 border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-neutral-300 dark:hover:bg-neutral-500 focus:bg-neutral-300 dark:focus:bg-neutral-500 placeholder:text-neutral-500 dark:placeholder:text-neutral-300 outline-none rounded'
            placeholder='아이디를 입력해주세요' />
        </div>
        <div className='flex justify-between items-center gap-2'>
          <label className='font-bold' htmlFor='password'>비밀번호</label>
          <input
            type='password'
            ref={passwordRef}
            className='p-2 border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-neutral-300 dark:hover:bg-neutral-500 focus:bg-neutral-300 dark:focus:bg-neutral-500 placeholder:text-neutral-500 dark:placeholder:text-neutral-300 outline-none rounded'
            placeholder='비밀번호를 입력해주세요' />
        </div>
        <button className='border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white p-2 font-bold hover:bg-neutral-300 dark:hover:bg-neutral-500 active:bg-neutral-500 dark:active:bg-neutral-300 rounded'>로그인</button>
      </form>
      <SocialLoginButtons />
      <div className='flex justify-center'>
        <p className='text-black dark:text-white'>처음이신가요?</p>&nbsp;
        <Link
          href='/auth/signup'
          className='font-bold border-black dark:border-white text-neutral-300 dark:text-neutral-500 hover:text-neutral-500 dark:hover:text-neutral-300'
        >회원가입</Link>
      </div>
    </div>
  );
}

const LoginAlert = (errorMessage: string) => {
  return (
    <div
      className='border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white p-4 w-full rounded'
      role='alert'
    >{errorMessage}</div>
  );
}