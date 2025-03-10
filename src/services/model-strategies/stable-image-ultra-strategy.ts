import axios from "axios";
import {
  ModelGenerationStrategy,
  ModelApiConfig,
  GenerationParams,
} from "@/types/model-config";

export class StableImageUltraStrategy implements ModelGenerationStrategy {
  // Prepare Stable Image Ultra-specific parameters before API call
  prepareParams(
    baseParams: GenerationParams,
    modelConfig: ModelApiConfig
  ): GenerationParams {
    // Stable Image Ultra-specific parameter transformations
    const preparedParams: GenerationParams = {
      // Convert generic parameters to Stable Image Ultra-specific format

      prompt: baseParams.prompt,
      negative_prompt: baseParams.negativePrompt,

      // Stable Image Ultra-specific parameters with fallback values
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

      // Optional Stable Image Ultra-specific parameters
      ...(baseParams.seed !== undefined && { seed: baseParams.seed }),
    };
    return preparedParams;
  }

  // Execute image generation for Stable Image Ultra
  async executeGeneration(
    params: GenerationParams,
    modelConfig: ModelApiConfig
  ): Promise<any> {
    try {
      // Stability AI Stable Image Ultra-specific API call
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
      console.error("Stable Image Ultra Generation Error:", error);
      throw error;
    }
  }
}
