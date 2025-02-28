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
import { ModelDialog } from './ModelDialog';
import { toast } from "sonner";

export function ModelSelector() {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const defaultUserId = import.meta.env.VITE_SUPABASE_DEFAULT_USER_ID;

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const userModels = await DatabaseService.getModelsByUser(defaultUserId);
        
        setModels(userModels);
        
        // Auto-select the first model if available
        if (userModels.length > 0) {
          setSelectedModel(userModels[0].id);
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

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    // You can add additional logic here, like updating global state
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center space-x-2">
        <Select 
          value={selectedModel || undefined}
          onValueChange={handleModelChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}