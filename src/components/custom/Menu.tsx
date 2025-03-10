import React from "react";
import { Button } from "@/components/ui/button";
import { LayersIcon, TagIcon, LayoutGridIcon } from "lucide-react";
import { ProjectDialog } from "./ProjectDialog";
import { ModelDialog } from "./ModelDialog";

const Menu: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex space-x-4">
          <ProjectDialog />
          <ModelDialog />
          <Button variant="ghost" size="sm">
            <TagIcon className="mr-2 h-4 w-4" /> Tags
          </Button>
          <Button variant="ghost" size="sm">
            <LayoutGridIcon className="mr-2 h-4 w-4" /> Collections
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Menu;
