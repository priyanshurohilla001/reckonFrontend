import { Link } from "react-router-dom";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { 
  ShoppingBag, 
  Film, 
  Home, 
  GraduationCap, 
  ShoppingCart, 
  Plane, 
  Heart, 
  Zap, 
  CircleDollarSign, 
  SubscriptIcon 
} from "lucide-react";

// Map of category icons
const categoryIcons = {
  "Food": <ShoppingBag className="h-5 w-5" />,
  "Entertainment": <Film className="h-5 w-5" />,
  "Tuition": <GraduationCap className="h-5 w-5" />,
  "Rent": <Home className="h-5 w-5" />,
  "Shopping": <ShoppingCart className="h-5 w-5" />,
  "Travel": <Plane className="h-5 w-5" />,
  "Healthcare": <Heart className="h-5 w-5" />,
  "Utilities": <Zap className="h-5 w-5" />,
  "Miscellaneous": <CircleDollarSign className="h-5 w-5" />,
  "Subscriptions": <SubscriptIcon className="h-5 w-5" />
};

export function CategoryCard({ category }) {
  const icon = categoryIcons[category] || <CircleDollarSign className="h-5 w-5" />;
  
  return (
    <Link to={`/category/${category.toLowerCase()}`}>
      <Card className="hover:bg-accent transition-colors">
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <CardTitle className="text-base font-medium">{category}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
          Click to view {category.toLowerCase()} expenses
        </CardContent>
      </Card>
    </Link>
  );
}