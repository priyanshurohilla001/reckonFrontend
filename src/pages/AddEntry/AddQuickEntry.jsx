import { QuickEntry } from "@/components/entry/QuickEntry";
import { Card, CardContent } from "@/components/ui/card";
import { Zap } from "lucide-react";

export default function AddQuickEntry() {
  return (
    <div className="container mx-auto px-4 py-4 max-w-md">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Zap className="h-4 w-4 text-yellow-500" />
        <h1 className="text-xl font-bold">Quick Entry</h1>
      </div>
      
      <Card>
        <CardContent className="p-4">
          <QuickEntry />
        </CardContent>
      </Card>
    </div>
  );
}
