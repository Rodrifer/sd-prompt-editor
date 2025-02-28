// src/components/custom/ProjectSelector.tsx
import React, { useState, useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { DatabaseService } from '@/services/database.service';
import { Project } from '@/types/supabase';
//import { useAuth } from '@/hooks/useAuth';


export function ProjectSelector() {
  //const { user } = vite
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
       //(!user) return;

      try {
        const userProjects = await DatabaseService.getProjectsByUser(import.meta.env.VITE_SUPABASE_DEFAULT_USER_ID);
        setProjects(userProjects);
        
        // Auto-select the first project if available
        if (userProjects.length > 0) {
          setSelectedProject(userProjects[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch projects', error);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectChange = (projectId: string) => {
    setSelectedProject(projectId);
    // You can add additional logic here, like updating global state or context
  };

  // If no user, return null or a sign-in prompt
  /*if (!user) {
    return null;
  }*/

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center space-x-2">
        <Select 
          value={selectedProject || undefined}
          onValueChange={handleProjectChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}