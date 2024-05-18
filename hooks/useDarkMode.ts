'use client';

import { useState } from "react"

export const useDarkMode = () => {
	const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

	const handleDarkMode = () => {
		console.log(isDarkMode);
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
	}
	
	return {isDarkMode, handleDarkMode};
}