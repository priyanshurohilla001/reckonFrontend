import { SpeechEntry } from "@/components/entry/SpeechEntry";

export default function AddSpeechEntry() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Speech Entry</h1>
      <SpeechEntry />
    </div>
  );
}
