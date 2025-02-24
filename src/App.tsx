import React from "react";
import { Outlet } from "react-router-dom";
import Layout from "./components/custom/Layout";
import { PromptProvider } from "./context/PromptContext";

const App: React.FC = () => {
  return (
    <PromptProvider>
      <Layout>
        <Outlet />
      </Layout>
    </PromptProvider>
  );
};

export default App;
