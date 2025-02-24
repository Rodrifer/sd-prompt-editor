import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <main className="flex-grow w-full p-4 bg-gray-100 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;