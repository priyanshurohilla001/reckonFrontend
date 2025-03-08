import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Wallet, Plus } from "lucide-react"

export function Header({ userData }) {
  return (
    <div className="w-full px-4 py-2 flex justify-between items-center border-b">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={userData?.profileImage} />
          <AvatarFallback>{userData?.name?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-1">
          <Wallet className="h-4 w-4" />
          <span>₹{userData?.money || 0}</span>
        </div>
      </div>
      <Button size="icon" variant="ghost">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}
