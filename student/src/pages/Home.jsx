import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, 
  Mic, 
  Bot, 
  LineChart, 
  Sparkles
} from "lucide-react";

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-violet-950 text-white">
      {/* Navigation Bar */}
      <nav className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Reckon
        </div>
        <div className="flex gap-4">
          {isAuthenticated ? (
            <Button 
              variant="outline" 
              className="border-indigo-500 hover:bg-indigo-900 transition-all text-white"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>
          ) : (
            <>
              <Button 
                variant="ghost" 
                className="hover:bg-indigo-900/30 text-white transition-all"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button 
                variant="default"
                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white transition-all"
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            </>
          )}
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Be Smart With Your Money
            </h1>
            <p className="text-xl text-gray-300">
              Financial tracking and learning built specifically for college students
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                variant="default"
                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 px-8 py-6 text-lg text-white transition-all"
                onClick={() => navigate('/register')}
              >
                Start Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 

                className="border-indigo-500 hover:bg-indigo-900/30 text-white px-8 py-6 text-lg transition-all"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            </div>
            <p className="text-sm text-gray-400 italic">
              This is a fantasy financial learning platform designed for Indian students. All simulations are for educational purposes only.
            </p>
          </div>
          <div className="relative">
            <div className="w-full h-96 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-300">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center opacity-20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-6 bg-black/50 backdrop-blur-sm rounded-xl">
                  <p className="text-2xl font-bold">Financial Freedom Starts Here</p>
                  <p className="mt-2">Track. Learn. Succeed.</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-24 bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-3xl font-bold mb-16">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-indigo-900/30 to-violet-900/30 border-indigo-800/30 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <CardContent className="p-8">
                <div className="bg-black/30 p-3 rounded-full w-fit mb-4">
                  <Mic className="h-8 w-8 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Voice-Powered Expense Tracking</h3>
                <p className="text-gray-300">Add expenses using our AI-powered voice recognition. No manual entry needed!</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-900/30 to-violet-900/30 border-indigo-800/30 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <CardContent className="p-8">
                <div className="bg-black/30 p-3 rounded-full w-fit mb-4">
                  <Bot className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">AI-Powered Analysis</h3>
                <p className="text-gray-300">Get personalized insights and be better prepared for your financial future.</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-900/30 to-violet-900/30 border-indigo-800/30 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <CardContent className="p-8">
                <div className="bg-black/30 p-3 rounded-full w-fit mb-4">
                  <LineChart className="h-8 w-8 text-pink-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Financial Simulations</h3>
                <p className="text-gray-300">Learn through simulated real-world scenarios to make better financial decisions.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <Card className="bg-gradient-to-r from-indigo-900/60 to-violet-900/60 border-none backdrop-blur-sm">
          <CardContent className="p-12">
            <div className="text-center max-w-2xl mx-auto">
              <div className="flex justify-center mb-4">
                <Sparkles className="h-8 w-8 text-amber-300" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-white">Partner with Us</h2>
              <p className="mb-8 text-gray-200">
                Interested in reaching budget-conscious college students? Become a sponsor.
              </p>
              <Button 
                className="border-white hover:bg-white/10 text-white"
                onClick={() => window.location.href = 'mailto:sponsors@reckon.edu'}
              >
                Contact Us
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4 md:mb-0">
            Reckon
          </div>
          <div className="text-gray-400 text-sm">
            <a href="mailto:sponsors@reckon.edu" className="hover:text-white transition-colors">
              sponsors@reckon.edu
            </a>
            <p className="mt-2">© 2025 Reckon. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
