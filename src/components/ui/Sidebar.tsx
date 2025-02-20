import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white border-r p-4">
      <nav>
        <h2 className="text-xl font-bold mb-4">Menu</h2>
        <ul>
          <li className="mb-2">
            <Link to="/" className="hover:text-blue-600">Home</Link>
          </li>
          {/* Add more sidebar links as needed */}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;