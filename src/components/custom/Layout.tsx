import React from 'react';
import Sidebar from './Sidebar';
import Menu from './Menu';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-full">
      <Menu />
      <div className="mt-16 flex w-full"> {/* Add top margin to account for menu */}
        <Sidebar />
        <main className="flex-grow w-full p-4 bg-gray-100 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;