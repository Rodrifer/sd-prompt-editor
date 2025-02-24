import axios from "axios";
import { STABLE_DIFFUSION_CONFIG } from "@/config/stable-diffusion";

export interface StableDiffusionParams {
  prompt: string;
  negative_prompt?: string;
  width?: number;
  height?: number;
  steps?: number;
  cfg_scale?: number;
  samples?: number;
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

  async generateImage(params: StableDiffusionParams): Promise<string | null> {
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
        `${STABLE_DIFFUSION_CONFIG.BASE_URL}${STABLE_DIFFUSION_CONFIG.ENDPOINTS.TEXT_TO_IMAGE}`,
        requestParams,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          responseType: "arraybuffer",
        }
      );

      // Convert image to base64
      const base64Image = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      return `data:image/png;base64,${base64Image}`;
    } catch (error) {
      console.error("Error generating image:", error);
      return null;
    }
  }
}
