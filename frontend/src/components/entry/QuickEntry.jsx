import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, Plus } from "lucide-react";
import "@/components/ui/scrollbar-hide.css";

// Complete set of categories
const categoryOptions = [
  { id: "food", name: "Food", emoji: "🍔" },
  { id: "shopping", name: "Shopping", emoji: "🛍️" },
  { id: "transportation", name: "Transport", emoji: "🚗" },
  { id: "entertainment", name: "Fun", emoji: "🎬" },
  { id: "utilities", name: "Bills", emoji: "💡" },
  { id: "health", name: "Health", emoji: "💊" },
  { id: "education", name: "Education", emoji: "📚" },
  { id: "personal", name: "Personal", emoji: "👤" },
  { id: "travel", name: "Travel", emoji: "✈️" },
  { id: "housing", name: "Housing", emoji: "🏠" },
  { id: "miscellaneous", name: "Misc", emoji: "📦" }
];

// Common tags
const commonTags = ["groceries", "lunch", "dinner", "coffee", "taxi", "bills", "rent", "snacks", "drinks"];

export function QuickEntry({ onSuccess }) {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("miscellaneous");
  const [selectedTags, setSelectedTags] = useState([]);

  // Small preset amounts for tab-like buttons
  const presetAmounts = [20, 50, 100, 200, 500, 1000];
  
  const handlePresetAmount = (value) => {
    setAmount(value.toString());
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    setIsLoading(true);

    try {
      const currentDate = new Date().toISOString();
      const categoryName = categoryOptions.find(c => c.id === selectedCategory)?.name || "Miscellaneous";
      
      const payload = {
        title: `Quick ${categoryName.toLowerCase()} expense`,
        amount: parseFloat(amount),
        category: selectedCategory,
        date: currentDate,
        tags: selectedTags
      };
      
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/entries/quick`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      toast.success(`₹${amount} added successfully!`);
      setAmount("");
      setSelectedTags([]);
      
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error("Error adding quick entry:", error);
      const errorMessage = error.response?.data?.message || "Failed to add entry";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Amount Input and Quick Selectors - Made more prominent */}
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-base font-medium">Amount</span>
          <span className="text-lg font-semibold text-primary">₹{amount || "0"}</span>
        </div>
        
        {/* Custom amount input - Made larger */}
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="h-12 text-lg font-medium"
        />
        
        {/* Tab-like amount selectors - Made more prominent */}
        <div className="grid grid-cols-3 gap-2">
          {presetAmounts.map((presetAmount) => (
            <Button
              key={presetAmount}
              type="button"
              variant="outline"
              className={cn(
                "h-10 text-base",
                amount === presetAmount.toString() && "bg-primary/10 border-primary text-primary font-medium"
              )}
              onClick={() => handlePresetAmount(presetAmount)}
            >
              ₹{presetAmount}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Categories - Redesigned as horizontal tabs */}
      <div className="space-y-2">
        <span className="text-sm font-medium">Category</span>
        <div className="flex gap-1 overflow-x-auto pb-1 snap-x scrollbar-hide">
          {categoryOptions.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategorySelect(category.id)}
              className={cn(
                "flex items-center gap-1 py-1.5 px-3 rounded-full border whitespace-nowrap snap-start",
                selectedCategory === category.id ? 
                  "border-primary bg-primary/10 text-primary" : 
                  "border-border hover:bg-accent"
              )}
            >
              <span>{category.emoji}</span>
              <span className="text-xs font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Tags */}
      <div className="space-y-2">
        <span className="text-sm font-medium">Tags</span>
        <div className="flex flex-wrap gap-1.5">
          {commonTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className={cn(
                "text-xs py-1 px-2.5 capitalize cursor-pointer",
                selectedTags.includes(tag) ? 
                  "bg-primary/20 hover:bg-primary/30 text-primary border-primary" : 
                  "hover:bg-accent"
              )}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Submit Button - Made larger and more prominent */}
      <Button 
        onClick={handleSubmit}
        disabled={isLoading || !amount}
        className="w-full h-12 mt-2 text-base font-medium"
      >
        {isLoading ? (
          "Adding..."
        ) : (
          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            <span>Add Expense</span>
          </div>
        )}
      </Button>
    </div>
  );
}