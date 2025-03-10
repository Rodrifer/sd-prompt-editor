import React, { useContext } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ProjectSelector } from "./ProjectSelector";
import { PromptContext } from "../../context/PromptContext";
import { uploadImageToCloudinary } from "../../services/cloudinary.service";
import { ModelSelector } from "./ModelSelector";
import { StableDiffusionService } from "../../services/stable-diffusion.service";

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
    } catch (error) {
      console.error("Error calling the API:", error);
    }
  };

  return (
    <aside className="flex-shrink-0 w-64 bg-white border-r p-4">
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
