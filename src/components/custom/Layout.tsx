import React from "react";
import Sidebar from "./Sidebar";
import Menu from "./Menu";
import { Toaster } from "@/components/ui/sonner";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-full">
      <Menu />
      <div className="mt-16 flex w-full">
        <Sidebar />
        <main className="flex-1 p-4 bg-gray-100 overflow-auto">
          {children}
        </main>
        <Toaster />
      </div>
    </div>
  );
};

export default Layout;
