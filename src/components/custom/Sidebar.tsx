import React, { useContext } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ProjectSelector } from "./ProjectSelector";
import { StableDiffusionService } from "../../services/stable-diffusion.service";
import { PromptContext } from "../../context/PromptContext";
import { uploadImageToCloudinary } from "../../services/cloudinary.service";
import { ModelSelector } from "./ModelSelector";

const sidebarService = StableDiffusionService.getInstance();

const Sidebar: React.FC = () => {
  const {
    prompt,
    setPrompt,
    negativePrompt,
    setNegativePrompt,
    image,
    setImage,
  } = useContext(PromptContext) || {
    prompt: "",
    setPrompt: () => {},
    negativePrompt: "",
    setNegativePrompt: () => {},
    image: null,
    setImage: () => {},
  };

  const handleRunClick = async () => {
    try {
      const params = {
        text_prompts: [
          {
            //text: "Black and white coloring book, simple rough 1960 cartoon, black-and-white pen and ink line art, hand draw outline doodle of a smiling pirate parrot perched on a palm tree on a desert island",
            text: prompt,
            weight: 0.5,
          },
          {
            //text: "highly detailed, realism, photograph, painting, gray, grayscale, colorful, pencil drawing, cross-hatching, scribbles, silhouette, low-contrast, shading",
            text: negativePrompt,
            weight: -1,
          },
        ],
      };
      const result = await sidebarService.generateImage(params);

      if (!result) {
        console.error("No se pudo generar la imagen.");
        return;
      }

      const base64Image = result.artifacts[0].base64;
      //setImage(base64Image);

      const uploadResponse = await uploadImageToCloudinary(`data:image/png;base64,${base64Image}`);
      setImage(uploadResponse.url);
      console.log(uploadResponse);
    } catch (error) {
      console.error("Error al llamar a la API:", error);
    }
  };

  return (
    <aside className="w-96 bg-white border-r p-4">
      <h2 className="text-xl font-bold mb-4">Prompt Editor</h2>
      <h3>Project:</h3>
      <ProjectSelector />
      <h3>Model:</h3>
      <ModelSelector />
      <h3>Prompt:</h3>
      <Textarea className="w-full" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <h3>Negative Prompt:</h3>
      <Textarea className="w-full" value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} />
      <Button className="mt-4" onClick={handleRunClick}>
        Run
      </Button>
    </aside>
  );
};

export default Sidebar;
