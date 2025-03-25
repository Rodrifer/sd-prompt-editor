import { ImageIcon, Trash2 } from "lucide-react"
import { usePrompt } from "@/context/PromptContext"
import { DatabaseService } from "@/services/database.service"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import PromptDialog from "./PromptDialog"

interface Prompt {
  id: string;
  name: string;
  images?: { id: string; image_url: string }[];
  // Agrega otras propiedades de prompt si es necesario
}

export default function Right() {
  const { projectImagesAndPrompts, refreshProjectData } = usePrompt()
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)

  const handleDeletePrompt = async (promptId: string) => {
    try {
      const result = await DatabaseService.deletePromptAndImages(promptId);
      
      if (result.status === 'success') {
        toast.success('Prompt and images deleted successfully');
        await refreshProjectData();
      } else {
        toast.error(result.error || 'Failed to delete prompt');
      }
    } catch (error) {
      console.error('Error deleting prompt:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const handlePromptClick = (prompt: Prompt) => {
    setSelectedPrompt(prompt)
  };

  const handleCloseDialog = () => {
    setSelectedPrompt(null)
  };

  return (
    <aside className="w-full md:w-1/5 bg-muted p-4 border-l">
      <div className="font-medium text-lg mb-6">Prompts</div>

      <div className="space-y-6">
        {projectImagesAndPrompts.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No prompts found for this project
          </div>
        ) : (
          <div className="space-y-4">
            {projectImagesAndPrompts.map(({ prompt, images }) => (
              <div 
                key={prompt.id} 
                className="bg-background p-3 rounded-md shadow-sm hover:bg-accent transition-colors group"
                onClick={() => handlePromptClick({ ...prompt, images })}
              >
                <div className="flex items-start gap-3">
                  <ImageIcon className="h-5 w-5 mt-1 text-primary" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-semibold">{prompt.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(prompt.created_at).toLocaleDateString()}
                        </span>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Prompt?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the prompt and all associated images. 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeletePrompt(prompt.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {prompt.prompt}
                    </p>
                    {prompt.negative_prompt && (
                      <p className="text-xs text-destructive mt-1">
                        Negative: {prompt.negative_prompt}
                      </p>
                    )}
                    <div className="mt-2 flex gap-2 overflow-x-auto">
                      {images.map((image) => (
                        <img 
                          key={image.id} 
                          src={image.image_url} 
                          alt={prompt.name} 
                          className="w-16 h-16 object-cover rounded-sm"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <PromptDialog prompt={selectedPrompt} onClose={handleCloseDialog} />
    </aside>
  )
}