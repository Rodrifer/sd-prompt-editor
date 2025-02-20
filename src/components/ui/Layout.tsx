import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-grow p-4 bg-gray-100 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;