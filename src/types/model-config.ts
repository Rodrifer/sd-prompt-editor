export interface ModelApiConfig {
  id: string;
  name: string;
  url: string;
  supportedParams: {
    width?: boolean;
    height?: boolean;
    cfgScale?: boolean;
    clipGuidance?: boolean;
    sampler?: boolean;
    samples?: boolean;
    seed?: boolean;
    steps?: boolean;
    stylePreset?: boolean;
    extras?: boolean;
    aspectRatio?: boolean;
    mode?: boolean;
    image?: boolean;
    strength?: boolean;
    model?: boolean;
    outputFormat?: boolean;
  };
  defaultParams: {
    width?: number;
    height?: number;
    cfgScale?: number;
    clipGuidance?: string;
    sampler?: string;
    samples?: number;
    seed?: number;
    steps?: number;
    stylePreset?: string;
    extras?: string;
    aspectRatio?: string;
    mode?: string;
    image?: string;
    strength?: number;
    model?: string;
    outputFormat?: string;
  };
  apiKeyRequired: boolean;
  apiVersion: string;
}

export interface GenerationParams {
  [key: string]: any;
}

export interface ModelGenerationStrategy {
  prepareParams(
    baseParams: GenerationParams,
    modelConfig: ModelApiConfig
  ): GenerationParams;
  executeGeneration(
    params: GenerationParams,
    modelConfig: ModelApiConfig
  ): Promise<any>;
}
