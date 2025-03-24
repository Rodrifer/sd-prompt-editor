import React from "react";
import Sidebar from "./Sidebar";
import Menu from "./Menu";
import { Toaster } from "@/components/ui/sonner";
import Home from "@/pages/Home";
import Footer from "./Footer";
import Right from "./Right";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Menu />
      <div className="flex flex-col flex-1 md:flex-row">
        <Sidebar />
        <Home />
        <Right />
      </div>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Layout;
