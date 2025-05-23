// src/services/database.service.ts
import { supabase } from "@/lib/supabase";
import { User, Project, Model, ModelConfig, Prompt, Image, Collection } from "../types/supabase";
import { ModelApiConfig } from "@/types/model-config";

export const DatabaseService = {
  // User methods
  getUsers: async (): Promise<User[]> => {
    const { data, error } = await supabase.from("users").select("*");
    if (error) throw error;
    return data || [];
  },

  getUserById: async (id: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  // Project methods
  getProjects: async (): Promise<Project[]> => {
    const { data, error } = await supabase.from("projects").select("*");
    if (error) throw error;
    return data || [];
  },

  getProjectsByUser: async (userId: string): Promise<Project[]> => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  // Create a new project
  createProject: async (
    project: Omit<Project, "id" | "created_at" | "updated_at">
  ): Promise<Project> => {
    const { data, error } = await supabase
      .from("projects")
      .insert(project)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Update a project
  updateProject: async (
    id: string,
    updates: Partial<Project>
  ): Promise<Project> => {
    const { data, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Delete a project
  deleteProject: async (id: string): Promise<void> => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw error;
  },

  // Model methods
  createModel: async (
    model: Omit<Model, "id" | "created_at" | "updated_at">
  ): Promise<Model> => {
    const { data, error } = await supabase
      .from("models")
      .insert(model)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  getModelsByUser: async (userId: string): Promise<Model[]> => {
    const { data, error } = await supabase
      .from("models")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  getModelById: async (modelId: string): Promise<Model | null> => {
    const { data, error } = await supabase
      .from("models")
      .select("*")
      .eq("id", modelId)
      .single();
    if (error) throw error;
    return data;
  },

  getModelBySlug: async (modelSlug: string): Promise<Model | null> => {
    const { data, error } = await supabase
      .from("models")
      .select("*")
      .eq("slug", modelSlug)
      .single();
    if (error) throw error;
    return data;
  },

  getModelConfig: async (modelSlug: string): Promise<ModelApiConfig> => {
    const { data: modelData, error: modelError } = await supabase
      .from("models")
      .select("*")
      .eq("slug", modelSlug)
      .single();

    if (modelError) throw modelError;

    const { data: configData, error: configError } = await supabase
      .from("model_configs")
      .select("*")
      .eq("model_id", modelData.id)
      .single();

    if (configError) {
      console.error("Config error:", configError);
      throw configError;
    }

    const config = configData as ModelConfig;

    return {
      id: modelData.id,
      name: modelData.name,
      url: modelData.url ?? "",
      supportedParams: {
        width: config.width !== null,
        height: config.height !== null,
        cfgScale: config.cfg_scale !== null,
        clipGuidance: config.clip_guidance !== null,
        sampler: config.sampler !== null,
        samples: config.samples !== null,
        seed: config.seed !== null,
        steps: config.steps !== null,
        stylePreset: config.style_preset !== null,
        extras: config.extras !== null,
        aspectRatio: config.aspect_ratio !== null,
        mode: config.mode !== null,
        image: config.image !== null,
        strength: config.strength !== null,
        model: config.model !== null,
        outputFormat: config.output_format !== null,
      },
      defaultParams: {
        width: config.width ?? undefined,
        height: config.height ?? undefined,
        cfgScale: config.cfg_scale ?? undefined,
        clipGuidance: config.clip_guidance ?? undefined,
        sampler: config.sampler ?? undefined,
        samples: config.samples ?? undefined,
        seed: config.seed ?? undefined,
        steps: config.steps ?? undefined,
        stylePreset: config.style_preset ?? undefined,
        extras: config.extras ?? undefined,
        aspectRatio: config.aspect_ratio ?? undefined,
        mode: config.mode ?? undefined,
        image: config.image ?? undefined,
        strength: config.strength ?? undefined,
        model: config.model ?? undefined,
        outputFormat: config.output_format ?? undefined,
      },
      apiKeyRequired: true,
      apiVersion: "v1",
    };
  },

  // Get images and prompts for a specific project
  getProjectImagesAndPrompts: async (
    projectId: string
  ): Promise<Array<{
    prompt: Prompt;
    images: Image[];
  }>> => {
    // First, fetch all prompts for the project
    const { data: promptsData, error: promptsError } = await supabase
      .from("prompts")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (promptsError) throw promptsError;

    // For each prompt, fetch its associated images
    const projectData = await Promise.all(
      (promptsData || []).map(async (prompt) => {
        const { data: imagesData, error: imagesError } = await supabase
          .from("images")
          .select("*")
          .eq("prompt_id", prompt.id)
          .order("created_at", { ascending: false });

        if (imagesError) throw imagesError;

        return {
          prompt,
          images: imagesData || []
        };
      })
    );

    return projectData;
  },

  // Save generated image with its prompt
  saveGeneratedImage: async (
    imageUrl: string,
    prompt: string, 
    projectId: string, 
    modelId?: string,
    configId?: string,
    negativePrompt?: string,
    size?: string,
    metadata?: Record<string, any>
  ): Promise<{ 
    status: string;
  }> => {
    // First, create the prompt
    const { data: promptData, error: promptError } = await supabase
      .from("prompts")
      .insert({
        project_id: projectId,
        name: prompt.slice(0, 50), // Use first 50 chars as name
        prompt: prompt,
        negative_prompt: negativePrompt,
        is_favorite: false
      } as Prompt)
      .select()
      .single();

    if (promptError) throw promptError;

    // Then, create the image
    const { error: imageError } = await supabase
      .from("images")
      .insert({
        prompt_id: promptData.id,
        image_url: imageUrl,
        //size: size,
        //metadata: metadata || {},
        //model_id: modelId,
        //config_id: configId
      } as Image)
      .select()
      .single();

    if (imageError) throw imageError;

    return {
      status: "success"
    };
  },

  // Delete a prompt and its associated images
  deletePromptAndImages: async (
    promptId: string
  ): Promise<{ 
    status: string; 
    error?: string 
  }> => {
    try {
      // First, fetch all images associated with the prompt
      const { data: imagesData, error: imagesError } = await supabase
        .from("images")
        .select("*")
        .eq("prompt_id", promptId);

      if (imagesError) {
        console.error("Error fetching images:", imagesError);
        return { 
          status: "error", 
          error: "Failed to fetch associated images" 
        };
      }

      // Delete associated images from Cloudinary if URLs exist
      if (imagesData && imagesData.length > 0) {
        const cloudinaryDeletionPromises = imagesData
          .filter(image => image.image_url)
          .map(async (image) => {
            try {
              // Extract public ID from Cloudinary URL
              const publicId = image.image_url.split('/').pop()?.split('.')[0];
              if (publicId) {
                await fetch(`/api/cloudinary/delete`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ publicId })
                });
              }
            } catch (cloudinaryError) {
              console.error("Error deleting image from Cloudinary:", cloudinaryError);
            }
          });

        await Promise.all(cloudinaryDeletionPromises);
      }

      // Delete images from the database
      const { error: deleteImagesError } = await supabase
        .from("images")
        .delete()
        .eq("prompt_id", promptId);

      if (deleteImagesError) {
        console.error("Error deleting images:", deleteImagesError);
        return { 
          status: "error", 
          error: "Failed to delete associated images" 
        };
      }

      // Delete the prompt
      const { error: deletePromptError } = await supabase
        .from("prompts")
        .delete()
        .eq("id", promptId);

      if (deletePromptError) {
        console.error("Error deleting prompt:", deletePromptError);
        return { 
          status: "error", 
          error: "Failed to delete prompt" 
        };
      }

      return { status: "success" };
    } catch (error) {
      console.error("Unexpected error in deletePromptAndImages:", error);
      return { 
        status: "error", 
        error: "An unexpected error occurred" 
      };
    }
  },

  createCollection: async (collection: {
    user_id: string;
    name: string;
    description?: string;
  }): Promise<Collection> => {
    const { data, error } = await supabase
      .from("collections")
      .insert([collection])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  getCollections: async (): Promise<Collection[]> => {
    const { data, error } = await supabase
      .from("collections")
      .select("*");
    if (error) throw error;
    return data || [];
  }
};
