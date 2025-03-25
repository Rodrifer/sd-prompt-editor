import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Prompt {
  id: string;
  name: string;
  images?: { id: string; image_url: string }[];
}

interface PromptDialogProps {
  prompt: Prompt | null;
  onClose: () => void;
}

const PromptDialog: React.FC<PromptDialogProps> = ({ prompt, onClose }) => {
  return (
    <Dialog open={!!prompt} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{prompt?.name}</DialogTitle>
          <DialogDescription>
            Aquí están las imágenes asociadas con el prompt.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 flex gap-2 overflow-x-auto">
          {prompt?.images?.map((image) => (
            <img 
              key={image.id} 
              src={image.image_url} 
              alt={prompt?.name} 
              className="w-16 h-16 object-cover rounded-sm"
            />
          ))}
        </div>
        <div className="mt-4">
          <Button onClick={onClose}>Cerrar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromptDialog; 