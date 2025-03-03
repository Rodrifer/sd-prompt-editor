import axios from "axios";
import { STABLE_DIFFUSION_CONFIG } from "@/config/stable-diffusion";

export interface TextPrompt {
  text: string;
  weight: number;
}

export interface StableDiffusionParams {
  text_prompts?: TextPrompt[];
  width?: number;
  height?: number;
  steps?: number;
  cfg_scale?: number;
  samples?: number;
}

interface StableDiffusionResponse {
  artifacts: {
    base64: string;
    seed: number;
    finishReason: string;
  }[];
}

export class StableDiffusionService {
  private static instance: StableDiffusionService;
  private apiKey: string;

  private constructor() {
    this.apiKey = STABLE_DIFFUSION_CONFIG.API_KEY;
    if (!this.apiKey) {
      console.warn("Stable Diffusion API key is not set");
    }
  }

  public static getInstance(): StableDiffusionService {
    if (!StableDiffusionService.instance) {
      StableDiffusionService.instance = new StableDiffusionService();
    }
    return StableDiffusionService.instance;
  }

  async generateImage(
    params: StableDiffusionParams,
    model: string,
    project: string
  ): Promise<StableDiffusionResponse | null> {
    if (!this.apiKey) {
      console.error("API Key is required");
      return null;
    }

    const requestParams = {
      ...STABLE_DIFFUSION_CONFIG.DEFAULT_PARAMS,
      ...params,
    };

    try {
      const response = await axios.post(
        model,
        requestParams,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          responseType: "arraybuffer",
        }
      );

      const jsonData = JSON.parse(new TextDecoder().decode(response.data));
      return jsonData;
    } catch (error) {
      console.error("Error generating image:", error);
      return null;
    }
  }
}
