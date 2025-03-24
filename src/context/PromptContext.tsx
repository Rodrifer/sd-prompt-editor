import React, { createContext, useState, useContext, ReactNode } from "react";
import { DatabaseService } from "@/services/database.service";
import { Prompt, Image } from "@/types/supabase";

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
  projectImagesAndPrompts: Array<{
    prompt: Prompt;
    images: Image[];
  }>;
  setProjectImagesAndPrompts: (data: Array<{
    prompt: Prompt;
    images: Image[];
  }>) => void;
  refreshProjectData: () => Promise<void>;
}

export const PromptContext = createContext<PromptContextType | undefined>(
  undefined
);

export const PromptProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [prompt, setPrompt] = useState<string>("");
  const [negativePrompt, setNegativePrompt] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [model, setModel] = useState<string>("");
  const [modelSlug, setModelSlug] = useState<string>("");
  const [project, setProject] = useState<string>("");
  const [projectImagesAndPrompts, setProjectImagesAndPrompts] = useState<Array<{
    prompt: Prompt;
    images: Image[];
  }>>([]);

  const refreshProjectData = async () => {
    if (!project) return;

    try {
      const imagesAndPrompts = await DatabaseService.getProjectImagesAndPrompts(project);
      setProjectImagesAndPrompts(imagesAndPrompts);
    } catch (error) {
      console.error("Error refreshing project data:", error);
    }
  };

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
        projectImagesAndPrompts,
        setProjectImagesAndPrompts,
        refreshProjectData,
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
