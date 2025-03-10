import axios from "axios";
import {
  ModelGenerationStrategy,
  ModelApiConfig,
  GenerationParams,
} from "@/types/model-config";

export class StableDiffusionV16Strategy implements ModelGenerationStrategy {
  // Prepare Stable Diffusion V1.6-specific parameters before API call
  prepareParams(
    baseParams: GenerationParams,
    modelConfig: ModelApiConfig
  ): GenerationParams {
    // Stable Diffusion V1.6-specific parameter transformations
    const preparedParams: GenerationParams = {
      // Convert generic parameters to Stable Diffusion V1.6-specific format
      text_prompts: this.transformPrompts(baseParams),

      // Apply model configuration defaults with override capability
      width: baseParams.width || modelConfig.defaultParams.width || 1024,
      height: baseParams.height || modelConfig.defaultParams.height || 1024,

      // Stable Diffusion V1.6-specific parameters with fallback values
      cfg_scale: baseParams.cfgScale || modelConfig.defaultParams.cfgScale || 7,
      steps: baseParams.steps || modelConfig.defaultParams.steps || 30,
      samples: baseParams.samples || modelConfig.defaultParams.samples || 1,

      // Optional Stable Diffusion V1.6-specific parameters
      ...(baseParams.seed !== undefined && { seed: baseParams.seed }),
      ...(baseParams.stylePreset && { style_preset: baseParams.stylePreset }),
    };

    return preparedParams;
  }

  // Transform prompts to Stable Diffusion V1.6's text_prompts format
  private transformPrompts(
    baseParams: GenerationParams
  ): Array<{ text: string; weight: number }> {
    // Handle different prompt input formats
    if (Array.isArray(baseParams.text_prompts)) {
      return baseParams.text_prompts;
    }

    const prompts: Array<{ text: string; weight: number }> = [];

    // Primary prompt
    if (baseParams.prompt) {
      prompts.push({
        text: baseParams.prompt,
        weight: 1.0, // Default positive weight
      });
    }

    // Negative prompt
    if (baseParams.negativePrompt) {
      prompts.push({
        text: baseParams.negativePrompt,
        weight: -1.0, // Negative weight
      });
    }

    return prompts;
  }

  // Execute image generation for SDXL
  async executeGeneration(
    params: GenerationParams,
    modelConfig: ModelApiConfig
  ): Promise<any> {
    try {
      // Stability AI Stable Diffusion V1.6-specific API call
      const response = await axios.post(modelConfig.url, params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            import.meta.env.VITE_STABLE_DIFFUSION_API_KEY
          }`,
          Accept: "application/json",
        },
        responseType: "arraybuffer",
      });

      // Return the response
      return JSON.parse(new TextDecoder().decode(response.data));
    } catch (error) {
      console.error("SDXL Generation Error:", error);
      throw error;
    }
  }
}
