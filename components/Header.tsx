import { useDarkMode } from "@/hooks/useDarkMode";

export default function Header() {
  const {isDarkMode, handleDarkMode} = useDarkMode();
  
  return (
    <button
      type="button"
      onClick={handleDarkMode}
      className="border border-black dark:border-white bg-white dark:bg-black py-2 px-4 text-black dark:text-white rounded"
    >{(isDarkMode) ? 'Dark Mode' : 'Normal'}</button>
  );
}