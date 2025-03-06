import { ModelStrategyFactory } from "@/services/model-strategy-factory";
import { GenerationParams } from "@/types/model-config";
import { DatabaseService } from "@/services/database.service";

export class StableDiffusionService {
  static async generateImage(params: GenerationParams, modelSlug: string) {
    try {
      // Fetch model configuration from database
      const modelConfig = await DatabaseService.getModelConfig(modelSlug);

      // Get appropriate strategy
      const strategy = ModelStrategyFactory.getStrategy(modelSlug);

      // Prepare and execute generation
      const preparedParams = strategy.prepareParams(params, modelConfig);
      return strategy.executeGeneration(preparedParams, modelConfig);
    } catch (error) {
      console.error("Error generating image:", error);
      throw error;
    }
  }
}
