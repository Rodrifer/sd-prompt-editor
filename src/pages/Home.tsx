import React, { useContext } from "react";
import { Button } from "../components/ui/button";
import { PromptContext } from "../context/PromptContext";

const Home: React.FC = () => {
  const { image } = useContext(PromptContext) || { image: null };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="w-full h-full max-w-4xl bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
        {image && (
          <img 
            src={image} 
            alt="Generated" 
            className="w-full h-full object-cover" 
          />
        )}
        {!image && <p>No image generated yet</p>}
      </div>
      <Button className="mt-4 w-32">Save</Button>
    </div>
  );
};

export default Home;
