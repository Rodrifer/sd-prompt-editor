import React from "react";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-96 bg-white border-r p-4">
      <h2 className="text-xl font-bold mb-4">Prompt Editor</h2>
      <h3>Model:</h3>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Model" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sd15">Stable Diffusion 1.5</SelectItem>
          <SelectItem value="sdxl">Stable Diffusion XL</SelectItem>
          <SelectItem value="sd30">Stable Diffusion 3.0</SelectItem>
          <SelectItem value="sd35">Stable Diffusion 3.5</SelectItem>
        </SelectContent>
      </Select>

      <h3>Prompt:</h3>
      <Textarea className="w-full" />
      <h3>Negative Prompt:</h3>
      <Textarea className="w-full" />
      <Button className="mt-4">Run</Button>
    </aside>
  );
};

export default Sidebar;
