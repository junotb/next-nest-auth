"use client";

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from "react";

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      // API 라우트로 사용자 인증 요청 보내기
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        console.log('ok');
        // 인증 성공 시 보호된 페이지로 리다이렉트
        router.push('/');
      } else {
        // 인증 실패 시 에러 메시지 처리
        const { error } = await response.json();
        console.error('Login error:', error);
      }
    } catch (error) {
      console.error('Login error:', error);
      // 인증 오류 처리, 예: 에러 메시지 표시
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center gap-2 w-full max-w-xs text-sm"
    >
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
      <button
        type="submit"
        className="border py-1 rounded-lg hover:bg-neutral-500 active:bg-neutral-700"
      >Submit</button>
    </form>
  );
}