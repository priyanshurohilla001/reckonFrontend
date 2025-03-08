import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Overview() {
  const [categories, setCategories] = useState([
    "Food", "Entertainment", "Tuition", "Rent", "Shopping",
    "Travel", "Healthcare", "Utilities", "Miscellaneous", "Subscriptions"
  ]);
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Balance</CardDescription>
            <CardTitle className="text-2xl">₹24,500</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Monthly Spending</CardDescription>
            <CardTitle className="text-2xl">₹8,245</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Savings Goal</CardDescription>
            <CardTitle className="text-2xl">63% <span className="text-sm text-muted-foreground">of ₹15,000</span></CardTitle>
          </CardHeader>
        </Card>
      </div>
      
      <h3 className="text-lg font-semibold mb-3">Recent Transactions</h3>
      <p className="text-muted-foreground">Your recent transactions will appear here.</p>
      
      {/* Categories section */}
      <h3 className="text-lg font-semibold mt-6 mb-3">Categories</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(category => (
          <Card key={category} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <h4 className="font-medium">{category}</h4>
              <p className="text-sm text-muted-foreground mt-1">View details</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
