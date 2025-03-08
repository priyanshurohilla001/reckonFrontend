import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { QuickEntry } from "./QuickEntry";

export function QuickEntryContainer({ onSuccess }) {
  // Start with the quick entry open by default
  const [isOpen, setIsOpen] = useState(true);

  // Optional: store the user preference in localStorage
  useEffect(() => {
    const storedPreference = localStorage.getItem("quickEntryOpen");
    if (storedPreference !== null) {
      setIsOpen(storedPreference === "true");
    }
  }, []);

  const toggleOpen = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    // Optional: save preference
    localStorage.setItem("quickEntryOpen", newState.toString());
  };

  return (
    <Card className="mb-4">
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Quick Entry
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleOpen}
          className="h-8 w-8 p-0"
        >
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      
      {isOpen && (
        <CardContent className="px-4 py-3">
          <QuickEntry onSuccess={onSuccess} />
        </CardContent>
      )}
    </Card>
  );
}
