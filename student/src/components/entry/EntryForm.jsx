import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  X, 
  CalendarIcon, 
  Clock, 
  Calendar as CalendarIcon2,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, subDays, isSameDay } from "date-fns";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const categories = [
  "Food", "Entertainment", "Tuition", "Rent", "Shopping",
  "Travel", "Healthcare", "Utilities", "Miscellaneous", "Subscriptions"
];

export function EntryForm({ prefilledData = {}, onSuccess, onCancel }) {
  const today = new Date();
  const yesterday = subDays(today, 1);

  const [isLoading, setIsLoading] = useState(false);
  const [showNotes, setShowNotes] = useState(!!prefilledData.description);
  const [tagInput, setTagInput] = useState("");
  const [showDatePopover, setShowDatePopover] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    prefilledData.date 
      ? new Date(prefilledData.date) 
      : today
  );

  const [formData, setFormData] = useState({
    title: prefilledData.title || "",
    amount: prefilledData.amount || "",
    category: prefilledData.category || "",
    description: prefilledData.description || "",
    date: prefilledData.date || format(today, 'yyyy-MM-dd'),
    tags: prefilledData.tags ? prefilledData.tags.split(",").map(tag => tag.trim()).filter(Boolean) : [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setFormData((prev) => ({ 
      ...prev, 
      date: format(date, 'yyyy-MM-dd')
    }));
  };

  const setToday = () => {
    handleDateChange(today);
    setShowDatePopover(false);
  };

  const setYesterday = () => {
    handleDateChange(yesterday);
    setShowDatePopover(false);
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    
    const newTag = tagInput.trim();
    if (!formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const formatDateForDisplay = (date) => {
    const formattedDate = new Date(date);
    
    // Check if it's today
    if (isSameDay(formattedDate, today)) {
      return 'Today';
    }
    
    // Check if it's yesterday
    if (isSameDay(formattedDate, yesterday)) {
      return 'Yesterday';
    }
    
    // Return formatted date
    return format(formattedDate, 'PPP');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.amount || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
      };
      
      // Make API request
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/entries`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      toast.success("Entry added successfully!");
      
      // Call the success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error("Error adding entry:", error);
      const errorMessage = error.response?.data?.message || "Failed to add entry";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title Field */}
      <div>
        <Label htmlFor="title" className="text-base font-medium">Title *</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="What did you spend on?"
          required
          className="mt-1.5 h-12 text-base"
        />
      </div>

      {/* Amount Field */}
      <div>
        <Label htmlFor="amount" className="text-base font-medium">Amount (₹) *</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
          required
          className="mt-1.5 h-12 text-base"
        />
      </div>

      {/* Category Field */}
      <div>
        <Label htmlFor="category" className="text-base font-medium">Category *</Label>
        <Select 
          name="category"
          value={formData.category} 
          onValueChange={(value) => handleSelectChange("category", value)}
        >
          <SelectTrigger className="mt-1.5 h-12">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category.toLowerCase()}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date Field */}
      <div className="bg-muted/40 rounded-md p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            <span className="font-medium">{formatDateForDisplay(formData.date)}</span>
          </div>
          
          <Popover open={showDatePopover} onOpenChange={setShowDatePopover}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <CalendarIcon className="h-4 w-4 mr-1" /> 
                <span className="text-xs">Change</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-0">
              <div className="p-2 flex flex-col gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={setToday} 
                  className="justify-start font-normal"
                >
                  Today
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={setYesterday}
                  className="justify-start font-normal"
                >
                  Yesterday
                </Button>
                <div className="my-1 h-px bg-muted"></div>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      handleDateChange(date);
                      setShowDatePopover(false);
                    }
                  }}
                  initialFocus
                  className="border rounded-md"
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Tags Field - Always visible */}
      <div>
        <Label className="text-base font-medium">Tags</Label>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {formData.tags.map(tag => (
            <Badge 
              key={tag} 
              variant="secondary"
              className="px-2 py-1 text-sm gap-1 items-center"
            >
              {tag}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={() => removeTag(tag)}
              />
            </Badge>
          ))}
          {formData.tags.length === 0 && (
            <span className="text-sm text-muted-foreground italic">No tags added</span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            placeholder="Add tags (e.g., groceries, coffee, bills)"
            className="flex-1"
          />
          <Button 
            type="button" 
            size="icon" 
            variant="outline" 
            onClick={addTag}
            className="h-10 w-10"
            disabled={!tagInput.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Press Enter or comma to add a tag
        </p>
      </div>

      {/* Notes Field - Collapsible */}
      <Collapsible 
        open={showNotes} 
        onOpenChange={setShowNotes} 
        className="border rounded-md p-2"
      >
        <CollapsibleTrigger asChild>
          <Button 
            type="button"
            variant="ghost" 
            size="sm" 
            className="flex w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="font-medium">Notes</span>
            </div>
            {showNotes ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="pt-2">
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add any additional details about this expense..."
            rows={3}
            className="resize-none"
          />
        </CollapsibleContent>
      </Collapsible>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end pt-3">
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="flex-1 h-12"
          >
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={isLoading}
          className={cn("flex-1 h-12", onCancel ? "max-w-[50%]" : "w-full")}
        >
          {isLoading ? "Saving..." : "Save Entry"}
        </Button>
      </div>
    </form>
  );
}
