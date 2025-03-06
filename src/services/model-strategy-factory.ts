import { ModelGenerationStrategy } from "@/types/model-config";
import { SDXLGenerationStrategy } from "./model-strategies/sdxl-strategy";
//import { StableImageCoreStrategy } from "./model-strategies/stable-image-core-strategy";
//import { StableImageUltraStrategy } from "./model-strategies/stable-image-ultra-strategy";
//import { StableDiffusionV16Strategy } from "./model-strategies/stable-diffusion-v16-strategy";
//import { StableDiffusionSD3Strategy } from "./model-strategies/stable-diffusion-sd3-strategy";

export class ModelStrategyFactory {
  private static strategies: { [key: string]: ModelGenerationStrategy } = {
    'sdxl-10': new SDXLGenerationStrategy(),                       // SDXL 1.0
    //'stable-image-core': new StableImageCoreStrategy(),          // Stable Image Core
    //'stable-image-ultra ': new StableImageUltraStrategy(),       // Stable Image Ultra
    //'sd-16': new StableDiffusionV16Strategy(),                   // SD 1.6
    //'sd-30-35': new StableDiffusionSD3Strategy()                 // SD 3.0 & 3.5
  };

  // Method to retrieve the appropriate strategy for a given model slug
  static getStrategy(modelSlug: string): ModelGenerationStrategy {
    const strategy = this.strategies[modelSlug];
    if (!strategy) {
      throw new Error(`No strategy found for model: ${modelSlug}`);
    }
    return strategy;
  }

  // Optional: Method to register new strategies dynamically
  static registerStrategy(modelId: string, strategy: ModelGenerationStrategy) {
    this.strategies[modelId] = strategy;
  }

  // Optional: Method to list all available strategies
  static listAvailableStrategies(): string[] {
    return Object.keys(this.strategies);
  }
}