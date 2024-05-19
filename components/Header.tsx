'use client';

import { useState } from "react";

export default function Header() {
	const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

	const handleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
	};
  
  return (
    <div className="absolute top-0 py-4 w-96 text-right">
      <button
        type="button"
        onClick={handleDarkMode}
        className="border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white py-2 px-4 hover:bg-neutral-300 active:bg-neutral-500 dark:hover:bg-neutral-500 dark:active:bg-neutral-300 rounded"
      >{(isDarkMode) ? '다크모드' : '라이트모드'}</button>
    </div>
  );
}