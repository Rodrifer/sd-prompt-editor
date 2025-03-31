import { useEffect, useState } from "react";
import { DatabaseService } from "@/services/database.service";
import { Collection } from "@/types/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CollectionSelector() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>();

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const collections = await DatabaseService.getCollections();
        setCollections(collections);
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      }
    };

    fetchCollections();
  }, []);

  return (
    <Select
      value={selectedCollection}
      onValueChange={(value) => setSelectedCollection(value)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a collection" />
      </SelectTrigger>
      <SelectContent>
        {collections.map((collection) => (
          <SelectItem key={collection.id} value={collection.id}>
            {collection.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}