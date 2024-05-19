import { ReactNode } from 'react';
import Header from '@/components/Header';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className='flex flex-col justify-center items-center gap-4 w-full h-full'>
      <Header />
      {children}
    </div>
  );
};

export default Layout;