// src/components/custom/ModelDialog.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatabaseService } from "@/services/database.service";
import { Model } from "@/types/supabase";
import { toast } from "sonner";

interface ModelDialogProps {
  onModelCreated?: (model: Model) => void;
}

export function ModelDialog({ onModelCreated }: ModelDialogProps) {
  const [modelName, setModelName] = useState("");
  const [modelDescription, setModelDescription] = useState("");
  const [modelVersion, setModelVersion] = useState("");
  const [modelUrl, setModelUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleCreateModel = async () => {
    // Validate required fields
    if (!modelName || !modelUrl) {
      toast.error("Validation Error", {
        description: "Name and URL are required",
      });
      return;
    }

    try {
      const newModel = await DatabaseService.createModel({
        name: modelName,
        description: modelDescription || null,
        version: modelVersion,
        url: modelUrl || null,
        is_active: true,
      });

      // Reset form
      setModelName("");
      setModelDescription("");
      setModelVersion("");
      setModelUrl("");
      setIsOpen(false);

      // Callback to parent component
      onModelCreated?.(newModel);

      // Show success toast
      toast.success("Model Created", {
        description: `Model "${newModel.name}" has been created successfully.`,
      });
    } catch (error) {
      console.error("Failed to create model", error);

      toast.error("Error", {
        description: "Failed to create model. Please try again.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Model</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Model</DialogTitle>
          <DialogDescription>
            Fill in the details for your new model
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name *
            </Label>
            <Input
              id="name"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={modelDescription}
              onChange={(e) => setModelDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="version" className="text-right">
              Version
            </Label>
            <Input
              id="version"
              value={modelVersion}
              onChange={(e) => setModelVersion(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              URL *
            </Label>
            <Input
              id="url"
              value={modelUrl}
              onChange={(e) => setModelUrl(e.target.value)}
              className="col-span-3"
              type="url"
              required
            />
          </div>
        </div>
        <Button
          type="submit"
          onClick={handleCreateModel}
          disabled={!modelName || !modelUrl}
        >
          Create Model
        </Button>
      </DialogContent>
    </Dialog>
  );
}
