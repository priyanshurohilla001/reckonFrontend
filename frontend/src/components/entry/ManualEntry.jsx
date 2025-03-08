import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EntryForm } from "./EntryForm";

export function ManualEntry() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Manual Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <EntryForm />
      </CardContent>
    </Card>
  );
}
