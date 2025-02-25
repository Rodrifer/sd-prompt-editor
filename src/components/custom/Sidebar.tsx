import React, { useContext } from "react";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { StableDiffusionService } from "../../services/stable-diffusion.service";
import { PromptContext } from "../../context/PromptContext";

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
      setImage(result.artifacts[0].base64);
    } catch (error) {
      console.error("Error al llamar a la API:", error);
    }
  };

  return (
    <aside className="w-96 bg-white border-r p-4">
      <h2 className="text-xl font-bold mb-4">Prompt Editor</h2>
      <h3>Model:</h3>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Model" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sd15">Stable Diffusion 1.5</SelectItem>
          <SelectItem value="sdxl">Stable Diffusion XL</SelectItem>
          <SelectItem value="sd30">Stable Diffusion 3.0</SelectItem>
          <SelectItem value="sd35">Stable Diffusion 3.5</SelectItem>
        </SelectContent>
      </Select>

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
