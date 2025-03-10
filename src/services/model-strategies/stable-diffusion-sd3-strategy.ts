import axios from "axios";
import {
  ModelGenerationStrategy,
  ModelApiConfig,
  GenerationParams,
} from "@/types/model-config";

export class StableDiffusionSD3Strategy implements ModelGenerationStrategy {
  // Prepare SD3-specific parameters before API call
  prepareParams(
    baseParams: GenerationParams,
    modelConfig: ModelApiConfig
  ): GenerationParams {
    // SD3-specific parameter transformations
    const preparedParams: GenerationParams = {
      prompt: baseParams.prompt,
      negative_prompt: baseParams.negativePrompt,

      // SD3-specific parameters with fallback values
      mode:
        baseParams.mode || modelConfig.defaultParams.mode || "text-to-image",
      //strength: baseParams.strength || modelConfig.defaultParams.strength || 0.7,
      aspect_ratio:
        baseParams.aspectRatio ||
        modelConfig.defaultParams.aspectRatio ||
        "1:1",
      cfg_scale: baseParams.cfgScale || modelConfig.defaultParams.cfgScale || 7,
      //steps: baseParams.steps || modelConfig.defaultParams.steps || 30,
      style_preset:
        baseParams.stylePreset ||
        modelConfig.defaultParams.stylePreset ||
        "None",
      output_format:
        baseParams.outputFormat ||
        modelConfig.defaultParams.outputFormat ||
        "png",

      // Optional SD3-specific parameters
      ...(baseParams.seed !== undefined && { seed: baseParams.seed }),
    };

    return preparedParams;
  }

  // Execute image generation for SD3
  async executeGeneration(
    params: GenerationParams,
    modelConfig: ModelApiConfig
  ): Promise<any> {
    try {
      // Stability AI SD3-specific API call
      const formData = new FormData();
      Object.keys(params).forEach((key) => {
        formData.append(key, params[key]);
      });

      const response = await axios.post(modelConfig.url, formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${
            import.meta.env.VITE_STABLE_DIFFUSION_API_KEY
          }`,
          "Content-Type": "multipart/form-data",
        },
        responseType: "arraybuffer",
      });

      // Return the response
      return JSON.parse(new TextDecoder().decode(response.data));
    } catch (error) {
      console.error("SD3 Generation Error:", error);
      throw error;
    }
  }
}
