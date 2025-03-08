import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export function CategoryCard({ category }) {
  const navigate = useNavigate();
  
  // Category-specific styling and icons
  const getCategoryDetails = (category) => {
    const lowercaseCategory = category.toLowerCase();
    
    const styles = {
      food: {
        icon: "🍽️",
        gradient: "from-orange-400 to-red-400",
        bgColor: "bg-orange-100",
        iconBg: "bg-orange-200",
        hue: 24
      },
      entertainment: {
        icon: "🎬",
        gradient: "from-purple-400 to-indigo-400",
        bgColor: "bg-purple-100",
        iconBg: "bg-purple-200",
        hue: 270
      },
      tuition: {
        icon: "🎓",
        gradient: "from-blue-400 to-cyan-400",
        bgColor: "bg-blue-100",
        iconBg: "bg-blue-200",
        hue: 210
      },
      rent: {
        icon: "🏠",
        gradient: "from-green-400 to-emerald-400",
        bgColor: "bg-green-100",
        iconBg: "bg-green-200",
        hue: 150
      },
      shopping: {
        icon: "🛍️",
        gradient: "from-pink-400 to-rose-400",
        bgColor: "bg-pink-100",
        iconBg: "bg-pink-200",
        hue: 330
      },
      travel: {
        icon: "✈️",
        gradient: "from-sky-400 to-blue-400",
        bgColor: "bg-sky-100",
        iconBg: "bg-sky-200",
        hue: 200
      },
      healthcare: {
        icon: "🏥",
        gradient: "from-red-400 to-rose-400",
        bgColor: "bg-red-100",
        iconBg: "bg-red-200",
        hue: 0
      },
      utilities: {
        icon: "💡",
        gradient: "from-amber-400 to-yellow-400",
        bgColor: "bg-amber-100",
        iconBg: "bg-amber-200",
        hue: 45
      },
      miscellaneous: {
        icon: "📦",
        gradient: "from-slate-400 to-gray-400",
        bgColor: "bg-slate-100",
        iconBg: "bg-slate-200",
        hue: 210
      },
      subscriptions: {
        icon: "📱",
        gradient: "from-violet-400 to-purple-400",
        bgColor: "bg-violet-100",
        iconBg: "bg-violet-200",
        hue: 280
      }
    };
    
    return styles[lowercaseCategory] || {
      icon: "💰",
      gradient: "from-blue-400 to-teal-400",
      bgColor: "bg-blue-100",
      iconBg: "bg-blue-200",
      hue: 210
    };
  };

  const categoryDetails = getCategoryDetails(category);

  // More aggressive Framer Motion animations
  const cardVariants = {
    initial: { 
      y: 10, 
      opacity: 0.6,
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)" 
    },
    animate: { 
      y: 0, 
      opacity: 1,
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)", 
      transition: { type: "spring", stiffness: 300, damping: 15 } 
    },
    hover: { 
      y: -4, 
      boxShadow: "0px 12px 20px rgba(0, 0, 0, 0.1)",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { 
      scale: 0.96, 
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", 
      transition: { type: "spring", stiffness: 500, damping: 10 } 
    }
  };

  const iconVariants = {
    initial: { scale: 0.8, rotate: -10 },
    animate: { scale: 1, rotate: 0, transition: { type: "spring", stiffness: 500, delay: 0.1 } },
    hover: { 
      scale: 1.2, 
      rotate: 5, 
      transition: { type: "spring", stiffness: 300, damping: 8 } 
    }
  };

  const arrowVariants = {
    initial: { x: -5, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { delay: 0.2 } },
    hover: { 
      x: 3, 
      transition: { 
        repeat: Infinity, 
        repeatType: "reverse", 
        duration: 0.6 
      } 
    }
  };

  const barVariants = {
    initial: { scaleX: 0 },
    animate: { scaleX: 1, transition: { delay: 0.3 } },
    hover: { 
      scaleX: 1.03, 
      filter: "brightness(1.1)",
      transition: { duration: 0.3 } 
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      variants={cardVariants}
      className="w-full mb-3"
    >
      <Card 
        onClick={() => navigate(`/category/${category.toLowerCase()}`)}
        className={`cursor-pointer rounded-xl overflow-hidden border transition-all duration-300`}
      >
        <div className={`p-4 flex items-center justify-between ${categoryDetails.bgColor}`}>
          <div className="flex items-center gap-3">
            <motion.div 
              variants={iconVariants}
              className={`text-2xl ${categoryDetails.iconBg} h-10 w-10 rounded-full flex items-center justify-center`}
            >
              {categoryDetails.icon}
            </motion.div>
            <motion.h3 
              className="text-base font-semibold text-gray-800"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.15 } }}
            >
              {category}
            </motion.h3>
          </div>
          
          <motion.div 
            variants={arrowVariants}
            className={`h-8 w-8 rounded-full bg-gradient-to-br ${categoryDetails.gradient} flex items-center justify-center text-white`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </motion.div>
        </div>
        
        <motion.div 
          variants={barVariants}
          className={`h-1 w-full bg-gradient-to-r ${categoryDetails.gradient} origin-left`}
        ></motion.div>
      </Card>
    </motion.div>
  );
}