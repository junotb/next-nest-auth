'use client';

import { useState } from "react"

export const useDarkMode = () => {
	const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

	const handleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
	}
	
	return {isDarkMode, handleDarkMode};
}