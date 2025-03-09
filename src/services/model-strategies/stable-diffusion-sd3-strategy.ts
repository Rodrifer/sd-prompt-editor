import axios from 'axios';
import { 
  ModelGenerationStrategy, 
  ModelApiConfig, 
  GenerationParams 
} from '@/types/model-config';

export class StableDiffusionSD3Strategy implements ModelGenerationStrategy {
  // Prepare SD3-specific parameters before API call
  prepareParams(
    baseParams: GenerationParams, 
    modelConfig: ModelApiConfig
  ): GenerationParams {
    // SD3-specific parameter transformations
    const preparedParams: GenerationParams = {
      // Convert generic parameters to SD3-specific format
      //text_prompts: this.transformPrompts(baseParams),

      prompt: baseParams.prompt,
      negative_prompt: baseParams.negativePrompt,
      //mode: baseParams.mode,
      
      // Apply model configuration defaults with override capability
      //width: baseParams.width || modelConfig.defaultParams.width || 1024,
      //height: baseParams.height || modelConfig.defaultParams.height || 1024,
      
      // SD3-specific parameters with fallback values
      mode: baseParams.mode || modelConfig.defaultParams.mode || 'text-to-image',
      //strength: baseParams.strength || modelConfig.defaultParams.strength || 0.7,
      aspect_ratio: baseParams.aspectRatio || modelConfig.defaultParams.aspectRatio || '1:1',
      cfg_scale: baseParams.cfgScale || modelConfig.defaultParams.cfgScale || 7,
      //steps: baseParams.steps || modelConfig.defaultParams.steps || 30,
      //samples: baseParams.samples || modelConfig.defaultParams.samples || 1,
      style_preset: baseParams.stylePreset || modelConfig.defaultParams.stylePreset || 'None',
      output_format: baseParams.outputFormat || modelConfig.defaultParams.outputFormat || 'png',
      
      // Optional SD3-specific parameters
      ...(baseParams.seed !== undefined && { seed: baseParams.seed }),
      //...(baseParams.stylePreset && { style_preset: baseParams.stylePreset }),
    };

    return preparedParams;
  }

  // Transform prompts to SD3's text_prompts format
  /*private transformPrompts(baseParams: GenerationParams): Array<{text: string, weight: number}> {
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
  }*/

  // Execute image generation for SD3
  async executeGeneration(
    params: GenerationParams, 
    modelConfig: ModelApiConfig,
  ): Promise<any> {
    try {
      // Stability AI SD3-specific API call
      const formData = new FormData();
      Object.keys(params).forEach(key => {
        formData.append(key, params[key]);
      });

      const response = await axios.post(
        modelConfig.url,  // Use the model's specific URL
        formData,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_STABLE_DIFFUSION_API_KEY}`,
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'arraybuffer'
        }
      );

      // Process and return the response
      //return this.processResponse(response.data);

      const jsonData = JSON.parse(new TextDecoder().decode(response.data));
      console.log(jsonData);
      return jsonData;

    } catch (error) {
      console.error('SD3 Generation Error:', error);
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
        model: 'SD3',
        generatedAt: new Date().toISOString()
      }
    };
  }
}