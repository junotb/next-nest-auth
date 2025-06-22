"use client";

import { ReactNode, useState } from "react";
import clsx from "clsx";

interface CardLayoutProps {
  title: string;
  children: ReactNode;
}

export default function CardLayout({ title, children }: CardLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen((prev) => !prev);

  return (
    <div className="p-4 space-y-4 rounded-lg shadow hover:shadow-md transition cursor-pointer">
      <div
        onClick={handleToggle}
        className="flex items-center justify-between"
      >
        <h2 className="text-xl font-semibold">{title}</h2>
        <ArrowImage className={clsx("size-6", { "rotate-180": isOpen })} />
      </div>
      {isOpen && children}
    </div>
  );
}

interface ArrowImageProps {
  className?: string;
}

function ArrowImage({ className }: ArrowImageProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}