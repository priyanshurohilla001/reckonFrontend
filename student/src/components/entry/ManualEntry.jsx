import { Card, CardContent } from "@/components/ui/card";
import { EntryForm } from "./EntryForm";

export function ManualEntry({ onSuccess }) {
  return (
    <Card className="w-full border-0 shadow-none">
      <CardContent className="p-0">
        <EntryForm onSuccess={onSuccess} />
      </CardContent>
    </Card>
  );
}
