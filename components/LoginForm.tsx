"use client";

import { getProviders, signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from "react";

export default function LoginForm() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (session && status === 'authenticated') {
    router.push('/');
  }

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleClick = (provider: string) => {
    signIn(provider);
  }
  
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    signIn('credentials', { redirect: false, username: username, password: password });
  }

  useEffect(() => {
    const init = async () => {
      const providers = await getProviders();
      console.log("Providers", providers);
    }
    init();
  }, [])

  return (
    <div className="flex flex-col gap-2 w-full max-w-xs text-sm">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 justify-center"
      >
        <div className='flex flex-col gap-2'>
          <div className="flex justify-between items-center gap-2">
            <label htmlFor="email">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="px-2 py-1 focus:bg-neutral-300 text-black"
              placeholder="Enter Username"
            />
          </div>
          <div className="flex justify-between items-center gap-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="px-2 py-1 focus:bg-neutral-300 text-black"
              placeholder="Enter Password"
            />
          </div>
        </div>
        <div className='flex gap-2 justify-center'>
          <button
            onClick={() => handleClick('facebook')}
            className='flex justify-center items-center w-12 h-12 bg-white rounded-full'
          >
            <Image
              src="/images/icon-facebook.svg"
              width={20}
              height={20}
              alt="Facebook Login"
            />
          </button>
          <button
            onClick={() => handleClick('naver')}
            className='flex justify-center items-center w-12 h-12 bg-white rounded-full'
          >
            <Image
              src="/images/icon-naver.svg"
              width={20}
              height={20}
              alt="Naver Login"
            />
          </button>
          <button
            onClick={() => handleClick('kakao')}
            className='flex justify-center items-center w-12 h-12 bg-white rounded-full'
          >
            <Image
              src="/images/icon-kakao.svg"
              width={20}
              height={20}
              alt="Kakao Login"
            />
          </button>
          <button
            onClick={() => handleClick('google')}
            className='flex justify-center items-center w-12 h-12 bg-white rounded-full'
          >
            <Image
              src="/images/icon-google.svg"
              width={28}
              height={28}
              alt="Google Login"
            />
          </button>
        </div>
        <button
          type="submit"
          className="border py-1 rounded-lg hover:bg-neutral-500 active:bg-neutral-700"
        >Submit</button>
      </form>
    </div>
  );
}