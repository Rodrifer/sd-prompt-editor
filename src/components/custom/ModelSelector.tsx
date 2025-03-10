// src/components/custom/ModelSelector.tsx
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatabaseService } from "@/services/database.service";
import { Model } from "@/types/supabase";
import { toast } from "sonner";
import { usePrompt } from "@/context/PromptContext";

export function ModelSelector() {
  const [models, setModels] = useState<Model[]>([]);
  const { modelSlug, setModelSlug } = usePrompt();
  const defaultUserId = import.meta.env.VITE_SUPABASE_DEFAULT_USER_ID;

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const userModels = await DatabaseService.getModelsByUser(defaultUserId);

        setModels(userModels);

        // Auto-select the first model if available
        if (userModels.length > 0 && !modelSlug) {
          const firstModelSlug = userModels[0].slug;
          if (firstModelSlug) {
            setModelSlug(firstModelSlug);
          }
        }
      } catch (error) {
        console.error("Failed to fetch models", error);
        toast.error("Error", {
          description: "Failed to fetch models",
        });
      }
    };

    fetchModels();
  }, []);

  const handleModelChange = (modelSlug: string) => {
    setModelSlug(modelSlug);
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center space-x-2">
        <Select value={modelSlug || ""} onValueChange={handleModelChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            {models.map((modelItem) => (
              <SelectItem key={modelItem.slug} value={modelItem.slug || ""}>
                {modelItem.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
