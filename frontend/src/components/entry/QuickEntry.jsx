import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { entryService } from "@/services/api";
import { Loader2 } from "lucide-react";

const QUICK_AMOUNTS = [20, 50, 100, 200, 500, 1000];

export function QuickEntry() {
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleQuickAmountClick = async (quickAmount) => {
    try {
      setIsSubmitting(true);
      await entryService.createQuickEntry(quickAmount);
      navigate("/");
    } catch (error) {
      console.error("Error creating quick entry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) return;
    
    try {
      setIsSubmitting(true);
      await entryService.createQuickEntry(parseFloat(amount));
      navigate("/");
    } catch (error) {
      console.error("Error creating quick entry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl text-center">Quick Entry</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="bg-muted p-2 rounded-md">$</div>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg"
              min="0"
              step="0.01"
              required
              disabled={isSubmitting}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
            </Button>
          </div>
        </form>

        <div className="pt-2">
          <p className="text-sm text-muted-foreground mb-2">Common amounts</p>
          <div className="grid grid-cols-3 gap-2">
            {QUICK_AMOUNTS.map((quickAmount) => (
              <motion.div
                key={quickAmount}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleQuickAmountClick(quickAmount)}
                  disabled={isSubmitting}
                >
                  ${quickAmount}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="pt-2 text-center">
          <p className="text-xs text-muted-foreground">
            Quick entries are added to the Miscellaneous category
          </p>
        </div>
      </CardContent>
    </Card>
  );
}