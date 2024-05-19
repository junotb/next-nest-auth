'use client';

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useRef } from "react";

export default function Page() {
  const nameRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const profileImageRef = useRef<HTMLInputElement>(null);
  
  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <div className="flex flex-col gap-4 justify-center w-96 border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white p-4 rounded">
        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-4 justify-center rounded'
        >
          <div className='flex justify-between items-center gap-2'>
            <label className='font-bold' htmlFor='name'>이름</label>
            <input type="text" ref={nameRef} className="p-2 w-60 border border-black dark:border-white text-black dark:text-white bg-white dark:bg-black hover:bg-neutral-300 dark:hover:bg-neutral-500 focus:bg-neutral-300 dark:focus:bg-neutral-500 placeholder:text-neutral-500 dark:placeholder:text-neutral-300 outline-none rounded" />
          </div>
          <div className='flex justify-between items-center gap-2'>
            <label className='font-bold' htmlFor='username'>아이디</label>
            <input type="text" ref={usernameRef} className="p-2 w-60 border border-black dark:border-white text-black dark:text-white bg-white dark:bg-black hover:bg-neutral-300 dark:hover:bg-neutral-500 focus:bg-neutral-300 dark:focus:bg-neutral-500 placeholder:text-neutral-500 dark:placeholder:text-neutral-300 outline-none rounded" disabled />
          </div>
          <div className='flex justify-between items-center gap-2'>
            <label className='font-bold' htmlFor='profileImage'>내 사진</label>
            <div className="flex gap-2 w-60">
              <input type="text" ref={profileImageRef} className="p-2 w-48 border border-black dark:border-white text-black dark:text-white bg-white dark:bg-black hover:bg-neutral-300 dark:hover:bg-neutral-500 focus:bg-neutral-300 dark:focus:bg-neutral-500 placeholder:text-neutral-500 dark:placeholder:text-neutral-300 outline-none rounded" />
              <button type="button" className="p-2 w-12 border border-black dark:border-white bg-white hover:bg-neutral-300 dark:hover:bg-neutral-500 active:bg-neutral-500 dark:active:bg-neutral-300 rounded">
                <Image src="/images/icon-upload.svg" alt="upload" width={24} height={24} className="bg-transparent" />
              </button>
            </div>
          </div>
            <button className='border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white p-2 w-full font-bold hover:bg-neutral-300 dark:hover:bg-neutral-500 active:bg-neutral-500 dark:active:bg-neutral-300 text-center rounded'>수정하기</button>  
        </form>
      </div>
      <Link
        href='/'
        className='border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white p-2 w-96 font-bold hover:bg-neutral-300 dark:hover:bg-neutral-500 active:bg-neutral-500 dark:active:bg-neutral-300 text-center rounded'
      >뒤로가기</Link>
    </>
  );
}