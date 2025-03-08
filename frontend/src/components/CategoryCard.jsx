import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { 
  ShoppingCart, Utensils, Film, GraduationCap, Home, Plane, 
  ShoppingBag, Stethoscope, Lightbulb, Repeat, MoreHorizontal,
  TrendingUp, TrendingDown, Minus
} from "lucide-react";

const categoryIcons = {
  food: <Utensils className="h-5 w-5" />,
  entertainment: <Film className="h-5 w-5" />,
  tuition: <GraduationCap className="h-5 w-5" />,
  rent: <Home className="h-5 w-5" />,
  shopping: <ShoppingBag className="h-5 w-5" />,
  travel: <Plane className="h-5 w-5" />,
  healthcare: <Stethoscope className="h-5 w-5" />,
  utilities: <Lightbulb className="h-5 w-5" />,
  subscriptions: <Repeat className="h-5 w-5" />,
  miscellaneous: <MoreHorizontal className="h-5 w-5" />
};

const categoryColors = {
  food: "bg-amber-100 text-amber-700",
  entertainment: "bg-purple-100 text-purple-700",
  tuition: "bg-blue-100 text-blue-700",
  rent: "bg-green-100 text-green-700",
  shopping: "bg-pink-100 text-pink-700",
  travel: "bg-cyan-100 text-cyan-700",
  healthcare: "bg-red-100 text-red-700",
  utilities: "bg-yellow-100 text-yellow-700",
  subscriptions: "bg-indigo-100 text-indigo-700",
  miscellaneous: "bg-gray-100 text-gray-700"
};

export default function CategoryCard({ category, amount, count, trend = 0 }) {
  const categoryKey = category.toLowerCase();
  const icon = categoryIcons[categoryKey] || <ShoppingCart className="h-5 w-5" />;
  const colorClass = categoryColors[categoryKey] || "bg-gray-100 text-gray-700";
  
  // Format amount to have commas for thousands
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  }).format(Math.abs(amount));

  // Determine trend icon
  let trendIcon = <Minus className="h-4 w-4" />;
  let trendClass = "text-gray-500";
  
  if (trend > 0) {
    trendIcon = <TrendingUp className="h-4 w-4" />;
    trendClass = "text-green-600";
  } else if (trend < 0) {
    trendIcon = <TrendingDown className="h-4 w-4" />;
    trendClass = "text-red-600";
  }

  // Animation variants
  const cardVariants = {
    initial: { scale: 0.96, opacity: 0.6 },
    hover: { 
      scale: 1.03, 
      opacity: 1,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }
    },
    tap: { scale: 0.98 }
  };

  return (
    <Link to={`/category/${categoryKey}`} className="block h-full">
      <motion.div
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        variants={cardVariants}
        className="h-full"
      >
        <Card className="h-full border">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className={`rounded-full p-3 ${colorClass}`}>
                {icon}
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end space-x-1">
                  <span className={trendClass}>
                    {trendIcon}
                  </span>
                  <p className={`text-lg font-bold ${amount < 0 ? "text-red-600" : "text-green-600"}`}>
                    ₹{formattedAmount}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {count} {count === 1 ? "entry" : "entries"}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <h3 className="font-medium capitalize">{category}</h3>
            <div className="h-2 w-2 rounded-full bg-indigo-500 opacity-70"></div>
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  );
}