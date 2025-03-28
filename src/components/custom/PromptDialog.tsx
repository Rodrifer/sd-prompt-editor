import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface Prompt {
  id: string;
  name: string;
  images?: { id: string; image_url: string }[];
  prompt: string;
  negative_prompt?: string;
  created_at: string;
}

interface PromptDialogProps {
  prompt: Prompt | null;
  isOpen: boolean;
  onClose: () => void;
}

const handleCopyPrompt = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.success("Prompt copied to clipboard!");
};

const PromptDialog: React.FC<PromptDialogProps> = ({ prompt, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1200px]">
        <div className="grid grid-cols-2 gap-4">
          
          <div className="flex justify-center items-center">
            {prompt?.images?.[0] && (
              <img 
                src={prompt.images[0].image_url} 
                alt={prompt.name} 
                className="w-full h-[80vh] object-contain rounded-lg"
              />
            )}
          </div>

          <div>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold mb-2">{prompt?.name}</DialogTitle>
              <DialogDescription className="space-y-2">
                <div>
                  <label className="font-medium">Creado:</label>
                  <div className="mt-2">{new Date(prompt?.created_at).toLocaleDateString()}</div>
                </div>
                <div>
                  <label className="font-medium">Prompt:</label>
                  <button 
                    onClick={() => handleCopyPrompt(prompt?.prompt || "")}
                    className="p-2 hover:bg-accent rounded-md"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <textarea className="w-full h-[20vh] mt-2" value={prompt?.prompt || ""} readOnly></textarea>
                </div>
                {prompt?.negative_prompt && (
                  <div>
                    <label className="font-medium">Negative Prompt:</label>
                    <textarea className="w-full h-[20vh] mt-2" value={prompt?.negative_prompt} readOnly></textarea>
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromptDialog; 