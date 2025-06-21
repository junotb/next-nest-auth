import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  display: "swap",
  fallback: ['Apple SD Gothic Neo', 'sans-serif'],
});

export const metadata: Metadata = {
  title: "Next Nest Auth",
  keywords: ["Next.js", "Nest.js", "Authentication", "Auth"],
  description: "Nest.js과 Next.js를 이용한 인증 시스템 예제",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${notoSansKr.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
