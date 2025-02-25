export const STABLE_DIFFUSION_CONFIG = {
  BASE_URL: "https://api.stability.ai/v1/generation",
  API_KEY: import.meta.env.VITE_STABLE_DIFFUSION_API_KEY || "",
  ENDPOINTS: {
    SDXL_10: "/stable-diffusion-xl-1024-v1-0/text-to-image",
    SD_16: "/stable-diffusion-v1-6/text-to-image",
  },
  DEFAULT_PARAMS: {
    width: 1024,
    height: 1024,
    steps: 30,
    cfg_scale: 7,
    samples: 1,
  },
};
