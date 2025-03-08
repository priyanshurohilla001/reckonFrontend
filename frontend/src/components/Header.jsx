import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Wallet, Plus } from "lucide-react";

export function Header({ userData }) {
  return (
    <header className="w-full bg-white shadow-sm border-b px-4 py-3 flex justify-between items-center">
      <Avatar className="h-10 w-10">
        <AvatarImage src={userData?.profileImage} />
        <AvatarFallback>{userData?.name?.[0]}</AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Wallet className="h-6 w-6 font-bold text-primary" />
          <span className="text-xl font-semibold">₹{userData?.money || 0}</span>
        </div>
        <Button size="icon" variant="ghost">
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </header>
  );
}
