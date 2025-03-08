import { QuickEntryContainer } from "@/components/entry/QuickEntryContainer";

export function Dashboard() {
  const refreshData = () => {
    // Your data refresh logic here
  };
  
  return (
    <div className="container">
      <h1>Dashboard</h1>
      
      {/* QuickEntry is open by default */}
      <QuickEntryContainer onSuccess={refreshData} />
      
      {/* Rest of your dashboard content */}
    </div>
  );
}
