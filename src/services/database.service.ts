// src/services/database.service.ts
import { supabase } from '@/lib/supabase';
import { User, Project } from '../types/supabase';

export const DatabaseService = {
  // User methods
  getUsers: async (): Promise<User[]> => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    return data || [];
  },

  getUserById: async (id: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  // Project methods
  getProjects: async (): Promise<Project[]> => {
    const { data, error } = await supabase.from('projects').select('*');
    if (error) throw error;
    return data || [];
  },

  getProjectsByUser: async (userId: string): Promise<Project[]> => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    return data || [];
  },

  // Create a new project
  createProject: async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> => {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Update a project
  updateProject: async (id: string, updates: Partial<Project>): Promise<Project> => {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Delete a project
  deleteProject: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};