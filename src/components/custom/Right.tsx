import { Bell, Calendar, Star, MessageCircle, ImageIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { usePrompt } from "@/context/PromptContext"
import { Prompt, Image } from "@/types/supabase"
import { DatabaseService } from "@/services/database.service"

export default function Right() {
  const { project } = usePrompt()
  const [projectImagesAndPrompts, setProjectImagesAndPrompts] = useState<Array<{
    prompt: Prompt;
    images: Image[];
  }>>([])

  useEffect(() => {
    const fetchProjectImagesAndPrompts = async () => {
      if (!project) return

      try {
        const imagesAndPrompts = await DatabaseService.getProjectImagesAndPrompts(project)
        setProjectImagesAndPrompts(imagesAndPrompts)
      } catch (error) {
        console.error("Error fetching project images and prompts:", error)
      }
    }

    fetchProjectImagesAndPrompts()
  }, [project])

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
            {projectImagesAndPrompts.map(({ prompt, images }, index) => (
              <div 
                key={prompt.id} 
                className="bg-background p-3 rounded-md shadow-sm hover:bg-accent transition-colors"
              >
                <div className="flex items-start gap-3">
                  <ImageIcon className="h-5 w-5 mt-1 text-primary" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-semibold">{prompt.name}</h4>
                      <span className="text-xs text-muted-foreground">
                        {new Date(prompt.created_at).toLocaleDateString()}
                      </span>
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
    </aside>
  )
}
