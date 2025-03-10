// src/components/custom/ProjectSelector.tsx
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatabaseService } from "@/services/database.service";
import { Project } from "@/types/supabase";
import { toast } from "sonner";
import { usePrompt } from "@/context/PromptContext";

export function ProjectSelector() {
  const [projects, setProjects] = useState<Project[]>([]);
  const { project, setProject } = usePrompt();
  const defaultUserId = import.meta.env.VITE_SUPABASE_DEFAULT_USER_ID;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const userProjects = await DatabaseService.getProjectsByUser(
          defaultUserId
        );

        setProjects(userProjects);

        // Auto-select the first project if available
        if (userProjects.length > 0 && !project) {
          const firstProjectId = userProjects[0].id;
          if (firstProjectId) {
            setProject(firstProjectId);
          }
        }
      } catch (error) {
        console.error("Failed to fetch projects", error);
        toast.error("Error", {
          description: "Failed to fetch projects",
        });
      }
    };

    fetchProjects();
  }, []);

  const handleProjectChange = (projectId: string) => {
    setProject(projectId);
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center space-x-2">
        <Select value={project || ""} onValueChange={handleProjectChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((projectItem) => (
              <SelectItem key={projectItem.id} value={projectItem.id || ""}>
                {projectItem.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
