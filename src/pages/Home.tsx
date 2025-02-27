import React, { useContext } from "react";
import { Button } from "../components/ui/button";
import { PromptContext } from "../context/PromptContext";

const Home: React.FC = () => {
  const { image } = useContext(PromptContext) || { image: null };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-8 p-4">
      <div className="w-96 h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        {image && (
          <img src={image} alt="Generated" />
        )}
        {!image && (
          <p>No image generated yet</p>
        )}
      </div>
      <Button className="w-32">Save</Button>
    </div>
  );
};

export default Home;
