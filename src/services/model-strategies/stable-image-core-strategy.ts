import axios from "axios";
import {
  ModelGenerationStrategy,
  ModelApiConfig,
  GenerationParams,
} from "@/types/model-config";

export class StableImageCoreStrategy implements ModelGenerationStrategy {
  // Prepare Stable Image Core-specific parameters before API call
  prepareParams(
    baseParams: GenerationParams,
    modelConfig: ModelApiConfig
  ): GenerationParams {
    // Stable Image Core-specific parameter transformations
    const preparedParams: GenerationParams = {
      prompt: baseParams.prompt,
      negative_prompt: baseParams.negativePrompt,

      aspect_ratio:
        baseParams.aspectRatio ||
        modelConfig.defaultParams.aspectRatio ||
        "1:1",
      style_preset:
        baseParams.stylePreset ||
        modelConfig.defaultParams.stylePreset ||
        "None",
      output_format:
        baseParams.outputFormat ||
        modelConfig.defaultParams.outputFormat ||
        "png",

      ...(baseParams.seed !== undefined && { seed: baseParams.seed }),
    };
    return preparedParams;
  }

  // Execute image generation for Stable Image Core
  async executeGeneration(
    params: GenerationParams,
    modelConfig: ModelApiConfig
  ): Promise<any> {
    try {
      // Stability AI Stable Image Core-specific API call
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
      console.error("Stable Image Core Generation Error:", error);
      throw error;
    }
  }
}
