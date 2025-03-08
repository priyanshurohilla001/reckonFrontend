import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { WalletCards, PlusCircle, User, LogOut, Settings, Home } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';

const categories = [
  "Food",
  "Entertainment",
  "Tuition",
  "Rent",
  "Shopping",
  "Travel",
  "Healthcare",
  "Utilities",
  "Miscellaneous",
  "Subscriptions"
];

export default function Header({ userData }) {
  const [addEntryOpen, setAddEntryOpen] = useState(false);
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({
    category: "",
    amount: "",
    description: ""
  });
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
    toast.success('Logged out successfully');
  };

  const handleEntryChange = (e) => {
    const { name, value } = e.target;
    setNewEntry(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (value) => {
    setNewEntry(prev => ({
      ...prev,
      category: value
    }));
  };

  const handleAddEntry = async (e) => {
    e.preventDefault();
    setIsAddingEntry(true);
    
    try {
      // API call would go here
      // await createEntry(newEntry);
      
      toast.success("Entry added successfully!");
      setAddEntryOpen(false);
      setNewEntry({
        category: "",
        amount: "",
        description: ""
      });
    } catch (error) {
      toast.error("Failed to add entry");
    } finally {
      setIsAddingEntry(false);
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <WalletCards className="h-6 w-6 text-indigo-600" />
            <span className="font-bold text-lg bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Reckon
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-green-50 rounded-full px-3 py-1">
              <WalletCards className="h-4 w-4 text-green-600 mr-1.5" />
              <span className="font-medium text-green-700">
                ₹{userData?.money || 0}
              </span>
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full"
              onClick={() => setAddEntryOpen(true)}
            >
              <PlusCircle className="h-5 w-5 text-indigo-600" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity">
                  <AvatarImage src={userData?.avatar} />
                  <AvatarFallback className="bg-indigo-100 text-indigo-800">
                    {userData?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start p-2">
                  <div className="flex flex-col space-y-1">
                    <p className="font-medium">{userData?.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{userData?.email || 'user@example.com'}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/" className="cursor-pointer flex items-center">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Home</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <Dialog open={addEntryOpen} onOpenChange={setAddEntryOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Entry</DialogTitle>
            <DialogDescription>
              Record a new expense or income in your account.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddEntry} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                required
                onValueChange={handleCategoryChange}
                defaultValue={newEntry.category}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="100"
                value={newEntry.amount}
                onChange={handleEntryChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Lunch at cafeteria"
                value={newEntry.description}
                onChange={handleEntryChange}
                required
              />
            </div>
            
            <div className="flex justify-end pt-4">
              <Button type="button" variant="ghost" onClick={() => setAddEntryOpen(false)} className="mr-2">
                Cancel
              </Button>
              <Button type="submit" disabled={isAddingEntry}>
                {isAddingEntry ? "Adding..." : "Add Entry"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </header>
  );
}