import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PresetAmountButton } from "./PresetAmountButton";

export function QuickEntry() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const presetAmounts = [20, 50, 100, 200, 500, 1000];
  
  const handlePresetAmount = (value) => {
    setAmount(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    setIsLoading(true);

    try {
      const currentDate = new Date().toISOString();
      
      // Create the payload for quick entry
      // It will go into the Miscellaneous category by default
      const payload = {
        title: `Quick entry - ₹${amount}`,
        amount: parseFloat(amount),
        category: "miscellaneous",
        date: currentDate,
        description: `Quick entry made on ${new Date().toLocaleDateString()}`
      };
      
      // Make API request
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
      navigate("/");
      
    } catch (error) {
      console.error("Error adding quick entry:", error);
      const errorMessage = error.response?.data?.message || "Failed to add entry";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Quick Entry</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-lg">Enter Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="text-lg py-6"
              autoFocus
            />
          </div>
          
          <Tabs defaultValue="common">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="common">Common Amounts</TabsTrigger>
              <TabsTrigger value="custom">Custom Presets</TabsTrigger>
            </TabsList>
            
            <TabsContent value="common" className="mt-4">
              <div className="grid grid-cols-3 gap-3">
                {presetAmounts.map((presetAmount) => (
                  <PresetAmountButton
                    key={presetAmount}
                    amount={presetAmount}
                    onClick={handlePresetAmount}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="custom" className="mt-4">
              <p className="text-center text-muted-foreground py-4">
                Your custom presets will appear here once you create them.
              </p>
            </TabsContent>
          </Tabs>
        </form>
      </CardContent>
      
      <CardFooter className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isLoading || !amount}
        >
          {isLoading ? "Saving..." : "Save Entry"}
        </Button>
      </CardFooter>
    </Card>
  );
}