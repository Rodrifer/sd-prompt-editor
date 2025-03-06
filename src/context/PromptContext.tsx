import React, { createContext, useState, useContext, ReactNode } from "react";

interface PromptContextType {
  prompt: string;
  setPrompt: (prompt: string) => void;
  negativePrompt: string;
  setNegativePrompt: (negativePrompt: string) => void;
  image: string | null;
  setImage: (image: string | null) => void;
  model: string;
  setModel: (model: string) => void;
  modelSlug: string;
  setModelSlug: (modelSlug: string) => void;
  project: string;
  setProject: (project: string) => void;
}

export const PromptContext = createContext<PromptContextType | undefined>(undefined);

export const PromptProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [prompt, setPrompt] = useState<string>("");
  const [negativePrompt, setNegativePrompt] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [model, setModel] = useState<string>("");
  const [modelSlug, setModelSlug] = useState<string>("");
  const [project, setProject] = useState<string>("");

  return (
    <PromptContext.Provider
      value={{
        prompt,
        setPrompt,
        negativePrompt,
        setNegativePrompt,
        image,
        setImage,
        model,
        setModel,
        modelSlug,
        setModelSlug,
        project,
        setProject,
      }}
    >
      {children}
    </PromptContext.Provider>
  );
};

export const usePrompt = () => {
  const context = useContext(PromptContext);
  if (context === undefined) {
    throw new Error("usePrompt must be used within a PromptProvider");
  }
  return context;
};
