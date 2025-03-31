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
import { toast } from "sonner";
import { LayoutGridIcon } from "lucide-react";

interface CollectionDialogProps {
  onCollectionCreated?: (collection: any) => void;
}

export function CollectionDialog({ onCollectionCreated }: CollectionDialogProps) {
  const [collectionName, setCollectionName] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleCreateCollection = async () => {
    // Validate required fields
    if (!collectionName) {
      toast.error("Collection name is required");
      return;
    }

    try {
      const newCollection = await DatabaseService.createCollection({
        user_id: import.meta.env.VITE_SUPABASE_DEFAULT_USER_ID,
        name: collectionName,
        description: collectionDescription,
      });

      toast.success("Collection created successfully");
      setIsOpen(false);
      onCollectionCreated?.(newCollection);
    } catch (error) {
      toast.error("Failed to create collection");
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <LayoutGridIcon className="mr-2 h-4 w-4" /> Collections
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Collection</DialogTitle>
          <DialogDescription>
            Add a new collection to organize your prompts.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="collectionName">Name</Label>
            <Input
              id="collectionName"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="collectionDescription">Description</Label>
            <Input
              id="collectionDescription"
              value={collectionDescription}
              onChange={(e) => setCollectionDescription(e.target.value)}
            />
          </div>
          <Button onClick={handleCreateCollection}>Create Collection</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}