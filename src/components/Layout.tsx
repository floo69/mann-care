import { ReactNode } from 'react';
import BottomNav from './BottomNav';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen page-gradient">
      <main className="pb-20 max-w-lg mx-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;
