import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { QuickEntryContainer } from '@/components/entry/QuickEntryContainer';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, BarChart, User, LogOut, Gamepad2 } from "lucide-react";

// Dashboard sub-pages
import Overview from '@/pages/dashboard/Overview';
import Insights from '@/pages/dashboard/Insights';
import Games from '@/pages/dashboard/Games';
import Profile from '@/pages/dashboard/Profile';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b py-4 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="font-bold text-xl text-primary">Reckon</Link>
          
          <div className="flex items-center gap-4">
            <div className="text-right mr-2 hidden sm:block">
              <p className="font-medium">{user?.name || 'User'}</p>
              <p className="text-sm text-muted-foreground">₹{user?.money || 0}</p>
            </div>
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.profileImage} />
              <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      
      <div className="flex flex-col flex-1">
        <div className="container mx-auto px-4 py-6">
          {/* QuickEntry - Open by default */}
          <QuickEntryContainer onSuccess={() => {/* Refresh data */}} />
          
          {/* Main Content Area */}
          <div className="mt-6">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/games" element={<Games />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t py-2 md:hidden">
        <div className="flex justify-around">
          <Link 
            to="/dashboard" 
            className={`flex flex-col items-center px-2 py-1 ${activeTab === 'overview' ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard size={24} />
            <span className="text-xs">Overview</span>
          </Link>
          
          <Link 
            to="/dashboard/insights" 
            className={`flex flex-col items-center px-2 py-1 ${activeTab === 'insights' ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('insights')}
          >
            <BarChart size={24} />
            <span className="text-xs">Insights</span>
          </Link>
          
          <Link 
            to="/dashboard/games" 
            className={`flex flex-col items-center px-2 py-1 ${activeTab === 'games' ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('games')}
          >
            <Gamepad2 size={24} />
            <span className="text-xs">Games</span>
          </Link>
          
          <Link 
            to="/dashboard/profile" 
            className={`flex flex-col items-center px-2 py-1 ${activeTab === 'profile' ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={24} />
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </nav>
      
      {/* Desktop Sidebar (display for md and up) */}
      <div className="hidden md:block fixed left-0 top-0 h-full w-64 bg-white border-r pt-20">
        <div className="px-4 py-2">
          <p className="font-medium text-sm text-muted-foreground">MENU</p>
          <nav className="mt-2 flex flex-col gap-1">
            <Link 
              to="/dashboard" 
              className={`flex items-center gap-2 px-4 py-2 rounded-md ${activeTab === 'overview' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'}`}
              onClick={() => setActiveTab('overview')}
            >
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </Link>
            
            <Link 
              to="/dashboard/insights" 
              className={`flex items-center gap-2 px-4 py-2 rounded-md ${activeTab === 'insights' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'}`}
              onClick={() => setActiveTab('insights')}
            >
              <BarChart size={18} />
              <span>Insights</span>
            </Link>
            
            <Link 
              to="/dashboard/games" 
              className={`flex items-center gap-2 px-4 py-2 rounded-md ${activeTab === 'games' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'}`}
              onClick={() => setActiveTab('games')}
            >
              <Gamepad2 size={18} />
              <span>Games</span>
            </Link>
            
            <Link 
              to="/dashboard/profile" 
              className={`flex items-center gap-2 px-4 py-2 rounded-md ${activeTab === 'profile' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={18} />
              <span>Profile</span>
            </Link>
          </nav>
        </div>
        
        <div className="absolute bottom-8 w-full px-4">
          <Button 
            variant="outline" 
            className="w-full flex items-center gap-2 justify-center"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
