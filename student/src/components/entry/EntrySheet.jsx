import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { QuickEntry } from "./QuickEntry";
import { SpeechEntry } from "./SpeechEntry";
import { ManualEntry } from "./ManualEntry";
import { Plus, Edit, Mic, Zap } from "lucide-react";

export function EntrySheet() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("quick");

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button 
          className="flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1.5 rounded-full font-medium text-sm"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] px-0 py-0 rounded-t-xl">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-3 rounded-t-xl">
          <h3 className="text-lg font-semibold">Add New Expense</h3>
          <p className="text-xs text-white/70">Track your spending easily</p>
        </div>
        
        <Tabs 
          defaultValue="quick" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="px-4 pt-2">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="quick" className="flex items-center gap-1">
                <Zap className="h-4 w-4" />
                <span>Quick</span>
              </TabsTrigger>
              <TabsTrigger value="speech" className="flex items-center gap-1">
                <Mic className="h-4 w-4" />
                <span>Speech</span>
              </TabsTrigger>
              <TabsTrigger value="manual" className="flex items-center gap-1">
                <Edit className="h-4 w-4" />
                <span>Manual</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="px-4 py-4 overflow-y-auto max-h-[calc(85vh-120px)]">
            <TabsContent value="quick">
              <QuickEntry onSuccess={() => setOpen(false)} />
            </TabsContent>
            
            <TabsContent value="speech">
              <SpeechEntry onSuccess={() => setOpen(false)} />
            </TabsContent>
            
            <TabsContent value="manual">
              <ManualEntry onSuccess={() => setOpen(false)} />
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
