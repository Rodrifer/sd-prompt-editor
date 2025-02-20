import React from 'react';
import { Outlet } from 'react-router-dom';
import Layout from './components/custom/Layout';

const App: React.FC = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default App;