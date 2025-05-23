import React from "react";
import { Button } from "@/components/ui/button";
import { TagIcon } from "lucide-react";
import { ProjectDialog } from "./ProjectDialog";
import { ModelDialog } from "./ModelDialog";
import { CollectionDialog } from "./CollectionDialog";

const Menu: React.FC = () => {
  return (
    <div className="container mx-auto flex bg-white shadow-md z-50">
      <div className="justify-between items-center p-4">
        <div className="flex space-x-4">
          <ProjectDialog />
          <ModelDialog />
          <Button variant="ghost" size="sm">
            <TagIcon className="mr-2 h-4 w-4" /> Tags
          </Button>
          <CollectionDialog />
        </div>
      </div>
    </div>
  );
};

export default Menu;
