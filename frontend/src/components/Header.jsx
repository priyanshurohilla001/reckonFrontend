// src/components/Header.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header({ userData }) {
  const navigate = useNavigate();

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "U";
  };

  // Format money with commas and currency symbol
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <LogoSection navigate={navigate} />

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Balance Chip */}
            <BalanceChip userData={userData} formatMoney={formatMoney} />

            {/* Add Button with Sheet */}
            <AddExpenseSheet navigate={navigate} />

            {/* User Profile */}
            <UserAvatar userData={userData} getInitials={getInitials} />
          </div>
        </div>
      </div>
    </motion.header>
  );
}

// Logo Section Component
function LogoSection({ navigate }) {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="flex items-center gap-2 cursor-pointer"
      onClick={() => navigate("/")}
    >
      <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </div>
      <h1 className="text-lg md:text-xl font-bold">Expense Tracker</h1>
    </motion.div>
  );
}

// Balance Chip Component
function BalanceChip({ userData, formatMoney }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="hidden md:flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 to-green-500/10 px-3 py-1 rounded-full"
    >
      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" />
          <path d="M14 15a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
          <path d="M6 15h4" />
          <path d="M6 11h4" />
        </svg>
      </div>
      <div>
        <div className="text-xs text-gray-500">Balance</div>
        <div className="text-sm font-semibold">{userData ? formatMoney(userData.money) : "Loading..."}</div>
      </div>
    </motion.div>
  );
}

// Add Expense Sheet Component
function AddExpenseSheet({ navigate }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1.5 rounded-full font-medium text-sm"
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
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span className="hidden sm:inline">Add</span>
        </motion.button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-auto rounded-t-xl px-0 py-0">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-3 rounded-t-xl">
          <h3 className="text-lg font-semibold">Add New Expense</h3>
          <p className="text-xs text-white/70">Choose your preferred entry method</p>
        </div>
        <div className="p-4 grid gap-4">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 py-6 text-base w-full border-2 hover:bg-indigo-50"
            onClick={() => navigate("/add/manual")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
            </svg>
            Manual Entry
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 py-6 text-base w-full border-2 hover:bg-indigo-50"
            onClick={() => navigate("/add/speech")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v20M8 5v14M4 9v6M20 9v6M16 5v14" />
            </svg>
            Speech Recognition
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 py-6 text-base w-full border-2 hover:bg-indigo-50"
            onClick={() => navigate("/add/quick")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m5 12 7-7 7 7" />
              <path d="M12 19V5" />
            </svg>
            Quick Entry
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// User Avatar Component
function UserAvatar({ userData, getInitials }) {
  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.4 }}
    >
      <Avatar className="h-8 w-8 md:h-10 md:w-10 border-2 border-indigo-200 cursor-pointer hover:border-indigo-300 transition-colors">
        <AvatarImage src={userData?.profileImage || ""} alt={userData?.name || "User"} />
        <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white text-xs md:text-sm">
          {userData?.name ? getInitials(userData.name) : "U"}
        </AvatarFallback>
      </Avatar>
    </motion.div>
  );
}