// src/components/custom/ModelSelector.tsx
import React, { useState, useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { DatabaseService } from '@/services/database.service';
import { Model } from '@/types/supabase';
import { toast } from "sonner";
import { usePrompt } from '@/context/PromptContext';

export function ModelSelector() {
  const [models, setModels] = useState<Model[]>([]);
  const { model, setModel } = usePrompt();
  const defaultUserId = import.meta.env.VITE_SUPABASE_DEFAULT_USER_ID;

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const userModels = await DatabaseService.getModelsByUser(defaultUserId);
        
        setModels(userModels);
        
        // Auto-select the first model if available
        if (userModels.length > 0 && !model) {
          const firstModelUrl = userModels[0].url;
          if (firstModelUrl) {
            setModel(firstModelUrl);
          }
        }
      } catch (error) {
        console.error('Failed to fetch models', error);
        toast.error("Error", {
          description: "Failed to fetch models"
        });
      }
    };

    fetchModels();
  }, []);

  const handleModelChange = (modelUrl: string) => {
    setModel(modelUrl);
    console.log(modelUrl);
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center space-x-2">
        <Select 
          value={model || ""}
          onValueChange={handleModelChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            {models.map((modelItem) => (
              <SelectItem key={modelItem.id} value={modelItem.url || ""}>
                {modelItem.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}