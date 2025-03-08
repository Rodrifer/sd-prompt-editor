import axios from 'axios';
import { 
  ModelGenerationStrategy, 
  ModelApiConfig, 
  GenerationParams 
} from '@/types/model-config';

export class StableDiffusionXLStrategy implements ModelGenerationStrategy {
  // Prepare SDXL-specific parameters before API call
  prepareParams(
    baseParams: GenerationParams, 
    modelConfig: ModelApiConfig
  ): GenerationParams {
    // SDXL-specific parameter transformations
    const preparedParams: GenerationParams = {
      // Convert generic parameters to SDXL-specific format
      text_prompts: this.transformPrompts(baseParams),
      
      // Apply model configuration defaults with override capability
      width: baseParams.width || modelConfig.defaultParams.width || 1024,
      height: baseParams.height || modelConfig.defaultParams.height || 1024,
      
      // SDXL-specific parameters with fallback values
      cfg_scale: baseParams.cfgScale || modelConfig.defaultParams.cfgScale || 7,
      steps: baseParams.steps || modelConfig.defaultParams.steps || 30,
      samples: baseParams.samples || modelConfig.defaultParams.samples || 1,
      
      // Optional SDXL-specific parameters
      ...(baseParams.seed !== undefined && { seed: baseParams.seed }),
      ...(baseParams.stylePreset && { style_preset: baseParams.stylePreset }),
    };

    return preparedParams;
  }

  // Transform prompts to SDXL's text_prompts format
  private transformPrompts(baseParams: GenerationParams): Array<{text: string, weight: number}> {
    // Handle different prompt input formats
    if (Array.isArray(baseParams.text_prompts)) {
      return baseParams.text_prompts;
    }

    const prompts: Array<{text: string, weight: number}> = [];

    // Primary prompt
    if (baseParams.prompt) {
      prompts.push({
        text: baseParams.prompt,
        weight: 1.0  // Default positive weight
      });
    }

    // Negative prompt
    if (baseParams.negativePrompt) {
      prompts.push({
        text: baseParams.negativePrompt,
        weight: -1.0  // Negative weight
      });
    }

    return prompts;
  }

  // Execute image generation for SDXL
  async executeGeneration(
    params: GenerationParams, 
    modelConfig: ModelApiConfig,
  ): Promise<any> {
    try {
      // Stability AI SDXL-specific API call
      const response = await axios.post(
        modelConfig.url,  // Use the model's specific URL
        params,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_STABLE_DIFFUSION_API_KEY}`,
            'Accept': 'application/json'
          },
          responseType: 'arraybuffer'
        }
      );

      // Process and return the response
      //return this.processResponse(response.data);

      const jsonData = JSON.parse(new TextDecoder().decode(response.data));
      return jsonData;

    } catch (error) {
      console.error('SDXL Generation Error:', error);
      throw error;
    }
  }

  // Process and transform the API response
  private processResponse(apiResponse: any): any {
    // Transform Stability AI's response to a standardized format
    return {
      images: apiResponse.artifacts.map((artifact: any) => ({
        base64: artifact.base64,
        seed: artifact.seed,
        finishReason: artifact.finishReason
      })),
      metadata: {
        model: 'SDXL 1.0',
        generatedAt: new Date().toISOString()
      }
    };
  }
}