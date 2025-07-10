"use client";

import CardLayout from "./CardLayout";

interface SocialLoginCardProps {
  handleClick: (provider: string) => void;
}

export default function SocialLoginCard({ handleClick }: SocialLoginCardProps) {
  return (
    <CardLayout title="소셜 로그인">
      <button
        type="button"
        onClick={() => handleClick("naver")}
        className="px-4 py-2 w-full text-sm font-medium hover:bg-gray-200 text-gray-700 rounded-md shadow"
      >네이버 로그인</button>
      <button
        type="button"
        onClick={() => handleClick("kakao")}
        className="px-4 py-2 w-full text-sm font-medium hover:bg-gray-200 text-gray-700 rounded-md shadow"
      >카카오 로그인</button>
      <button
        type="button"
        onClick={() => handleClick("google")}
        className="px-4 py-2 w-full text-sm font-medium hover:bg-gray-200 text-gray-700 rounded-md shadow"
      >구글 로그인</button>
    </CardLayout>
  );
}