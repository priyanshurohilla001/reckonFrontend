import { ManualEntry } from "@/components/entry/ManualEntry";

export default function AddManualEntry() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Manual Entry</h1>
      <ManualEntry />
    </div>
  );
}
