import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/lib/next-auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Nextjs Authentication',
  description: 'A Next.js application that implements authentication features using NextAuth and Firebase. It includes credential-based login, social login integration with popular platforms like Kakao, Naver, Google, and Facebook, as well as user registration functionality. Built with TypeScript for improved code quality and type safety.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
