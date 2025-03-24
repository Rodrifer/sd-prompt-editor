import React, { useContext, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ProjectSelector } from "./ProjectSelector";
import { PromptContext } from "../../context/PromptContext";
import { uploadImageToCloudinary } from "../../services/cloudinary.service";
import { ModelSelector } from "./ModelSelector";
import { StableDiffusionService } from "../../services/stable-diffusion.service";
import { DatabaseService } from "../../services/database.service";
import { toast } from "sonner";

const Sidebar: React.FC = () => {
  const {
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
    refreshProjectData // Add this from context
  } = useContext(PromptContext) || {
    prompt: "",
    setPrompt: () => {},
    negativePrompt: "",
    setNegativePrompt: () => {},
    image: null,
    setImage: () => {},
    model: "",
    setModel: () => {},
    modelSlug: "",
    setModelSlug: () => {},
    project: "",
    setProject: () => {},
    refreshProjectData: () => {}
  };

  const handleRunClick = async () => {
    try {
      const params = {
        prompt: prompt,
        negativePrompt: negativePrompt,
        width: 896,
        height: 1152,
      };

      const result = await StableDiffusionService.generateImage(
        params,
        modelSlug
      );

      if (!result) {
        console.error("The image could not be generated.");
        return;
      }

      let base64Image = "";
      if (!result.artifacts || result.artifacts.length === 0) {
        base64Image = result.image; // For SD3 and Core/Ultra
      } else {
        base64Image = result.artifacts[0].base64; // For SDXL and V16
      }

      if (!base64Image) {
        console.error("The image could not be generated.");
        return;
      }

      const uploadResponse = await uploadImageToCloudinary(
        `data:image/png;base64,${base64Image}`
      );
      setImage(uploadResponse.url);

      // Save image and prompt to database
      const { status } = await DatabaseService.saveGeneratedImage(
        uploadResponse.url,
        prompt,
        project,
        model,
        //configId,
        negativePrompt,
        //size,
        //metadata
      );

      if (status !== "success") {
        console.error("The image could not be saved to the database.");
        return;
      }

      // Refresh project data to update Right sidebar
      await refreshProjectData();

      toast.success("Image generated and saved to database.");
    } catch (error) {
      console.error("Error calling the API:", error);
      toast.error("Failed to generate or save image");
    }
  };

  return (
    <aside className="w-full md:w-1/5 bg-muted bg-white border-r p-4">
      <h2 className="text-xl font-bold mb-4">Prompt Editor</h2>
      <h3>Project:</h3>
      <ProjectSelector />
      <h3>Model:</h3>
      <ModelSelector />
      <h3>Prompt:</h3>
      <Textarea
        className="w-full mb-4 h-32"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <h3>Negative Prompt:</h3>
      <Textarea
        className="w-full mb-4 h-32"
        value={negativePrompt}
        onChange={(e) => setNegativePrompt(e.target.value)}
      />
      <Button className="mt-4" onClick={handleRunClick}>
        Run
      </Button>
    </aside>
  );
};

export default Sidebar;
