import React from "react";
import { Button } from "../components/ui/button";

const Home: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-8 p-4">
      <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">Image Placeholder</span>
      </div>
      <Button className="w-32">Save</Button>
    </div>
  );
};

export default Home;
