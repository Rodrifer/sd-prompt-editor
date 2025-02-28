// src/components/custom/ProjectDialog.tsx
import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatabaseService } from '@/services/database.service';
import { Project } from '@/types/supabase';
import { toast } from "sonner";

interface ProjectDialogProps {
  onProjectCreated?: (project: Project) => void;
}

export function ProjectDialog({ onProjectCreated }: ProjectDialogProps) {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleCreateProject = async () => {
    try {
      const newProject = await DatabaseService.createProject({
        user_id: import.meta.env.VITE_SUPABASE_DEFAULT_USER_ID,
        name: projectName,
        description: projectDescription,
        creation_date: new Date().toISOString(),
        update_date: new Date().toISOString(),
        is_public: false
      });

      toast.success("Project Created", {
        description: `Project "${newProject.name}" has been created successfully.`
      });

      // Reset form
      setProjectName('');
      setProjectDescription('');
      setIsOpen(false);

      // Callback to parent component
      onProjectCreated?.(newProject);
    } catch (error) {
      console.error('Failed to create project', error);
      toast.error("Error", {
        description: "Failed to create project. Please try again."
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Fill in the details for your new project
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input 
              id="name" 
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input 
              id="description" 
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="col-span-3" 
            />
          </div>
        </div>
        <Button 
          type="submit" 
          onClick={handleCreateProject}
          disabled={!projectName}
        >
          Create Project
        </Button>
      </DialogContent>
    </Dialog>
  );
}