import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Check, AlertTriangle, Calendar } from "lucide-react"

export function SpendingAnalysis({ balance = 3244, spendingData }) {
  // Default data if none is provided
  const defaultSpendingData = {
    categories: [
      {
        name: "Food",
        averageSpending: 80.49,
        dailyLimit: 80.00,
        withinLimit: true
      },
      {
        name: "Entertainment",
        averageSpending: 9.89,
        dailyLimit: 10.00,
        withinLimit: true
      },
      {
        name: "Shopping",
        averageSpending: 51.62,
        dailyLimit: 40.00,
        withinLimit: false
      },
      {
        name: "Rent",
        averageSpending: 33.59,
        dailyLimit: 26.00,
        withinLimit: false
      },
      {
        name: "Travel",
        averageSpending: 29.60,
        dailyLimit: 30.00,
        withinLimit: true
      }
    ],
    overspendingCategories: ["Shopping", "Rent"],
    recommendation: "To control spending, avoid overspending in 'Shopping'.",
    daysRemaining: 79.05
  }
  
  const data = spendingData || defaultSpendingData
  
  // Helper function to create a simple bar chart
  const renderBarChart = () => {
    const maxDays = 100; // Maximum days to show on chart
    const daysRemaining = Math.min(data.daysRemaining, maxDays);
    const percentage = (daysRemaining / maxDays) * 100;
    
    return (
      <div className="w-full flex flex-col space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0 days</span>
          <span>{maxDays} days</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-center text-sm mt-1">
          <Calendar className="h-4 w-4 mr-1" />
          <span>Your budget will last approximately <strong>{Math.round(daysRemaining)} days</strong></span>
        </div>
      </div>
    );
  };
  
  // Spending distribution pie chart simulation
  const renderPieChart = () => {
    // We'll create a simple visual representation of spending distribution
    const categories = data.categories;
    const totalSpending = categories.reduce((sum, cat) => sum + cat.averageSpending, 0);
    
    return (
      <div className="flex flex-col space-y-4">
        <div className="flex justify-center">
          <div className="w-48 h-48 rounded-full border-8 border-muted relative flex items-center justify-center">
            {/* Simulate pie chart segments */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              {categories.map((category, index) => {
                const percentage = (category.averageSpending / totalSpending) * 100;
                const colors = [
                  "bg-blue-500", "bg-green-500", "bg-yellow-500", 
                  "bg-red-500", "bg-purple-500", "bg-pink-500"
                ];
                const rotation = index === 0 ? 0 : 
                  categories.slice(0, index).reduce((sum, cat) => 
                    sum + (cat.averageSpending / totalSpending) * 360, 0);
                
                return (
                  <div 
                    key={category.name} 
                    className="absolute inset-0 origin-bottom-right"
                    style={{ 
                      transform: `rotate(${rotation}deg)`,
                      clipPath: `polygon(50% 50%, 50% 0, ${50 + percentage}% 0, 50% 50%)`
                    }}
                  >
                    <div className={`w-full h-full ${colors[index % colors.length]}`}></div>
                  </div>
                );
              })}
            </div>
            <div className="w-28 h-28 bg-background rounded-full flex items-center justify-center z-10">
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Balance</div>
                <div className="font-semibold">₹{balance.toFixed(0)}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {data.categories.map((category, index) => {
            const colors = ["bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-red-500", "bg-purple-500"];
            return (
              <div key={index} className="flex items-center text-xs">
                <div className={`w-3 h-3 rounded-full mr-2 ${colors[index % colors.length]}`}></div>
                <span className="truncate">{category.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  return (
    <Tabs defaultValue="graph" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="graph">Budget Timeline</TabsTrigger>
        <TabsTrigger value="details">Spending Details</TabsTrigger>
      </TabsList>
      <TabsContent value="graph" className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Budget Timeline</CardTitle>
            <CardDescription className="text-xs">Visualizing how long your money will last</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Days remaining bar */}
              <div className="bg-muted/30 rounded-md p-4">
                <h4 className="text-sm font-medium mb-3">Days Until Budget Depleted</h4>
                {renderBarChart()}
              </div>
              
              {/* Spending distribution */}
              <div className="bg-muted/30 rounded-md p-4">
                <h4 className="text-sm font-medium mb-3">Spending Distribution</h4>
                {renderPieChart()}
              </div>
              
              {/* Graph Image */}
              <div className="bg-muted/30 rounded-md p-4">
                <h4 className="text-sm font-medium mb-3">Detailed Spending Graph</h4>
                <img src="/src/assets/image.png" alt="Spending Trends Graph" className="w-full h-auto rounded-md" />
              </div>
              
              <div className="text-xs text-muted-foreground text-center">
                Go to Spending Details tab for a breakdown of your spending habits
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="details" className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Current Balance: ₹{balance.toFixed(0)}</CardTitle>
            <CardDescription className="text-xs">
              Based on your current spending, your balance will last for approximately {data.daysRemaining.toFixed(0)} days.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.categories.map((category, index) => (
              <Card key={index} className={`border-l-4 ${category.withinLimit ? 'border-l-green-500' : 'border-l-red-500'}`}>
                <CardHeader className="py-2 px-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm">{category.name}</CardTitle>
                    <div className="flex items-center">
                      {category.withinLimit ? (
                        <Check className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-xs font-medium ${category.withinLimit ? 'text-green-500' : 'text-red-500'}`}>
                        {category.withinLimit ? 'Within limit' : 'Overspending'}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="py-1 px-3">
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div>Average daily spending:</div>
                    <div className="font-medium text-right">₹{category.averageSpending.toFixed(2)}</div>
                    <div>Daily limit:</div>
                    <div className="font-medium text-right">₹{category.dailyLimit.toFixed(2)}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {data.overspendingCategories.length > 0 && (
              <Alert variant="destructive" className="text-xs">
                <AlertTriangle className="h-3 w-3" />
                <AlertTitle className="text-sm">Overspending detected</AlertTitle>
                <AlertDescription>
                  <p>Overspending in: {data.overspendingCategories.join(', ')}</p>
                  <p className="mt-1">{data.recommendation}</p>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
