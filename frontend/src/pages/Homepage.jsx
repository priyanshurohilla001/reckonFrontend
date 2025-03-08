import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowRight, Mic, Activity, GamepadIcon, Mail } from "lucide-react";

export default function Homepage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in by looking for token
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-12 px-4 md:py-20 text-center">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Be Smart With Your Money</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-6">
            Financial tracking and learning built specifically for college students
          </p>
          
          {/* CTA buttons */}
          <div className="space-x-4">
            {isLoggedIn ? (
              <Button size="lg" asChild>
                <Link to="/dashboard">
                  Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button size="lg" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Fantasy Game Warning */}
      <div className="container max-w-4xl mx-auto px-4 py-4">
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertDescription className="text-center text-sm">
            This is a fantasy financial learning platform designed for Indian students.
            All simulations are for educational purposes only.
          </AlertDescription>
        </Alert>
      </div>

      {/* Key Features */}
      <section className="container max-w-4xl mx-auto px-4 py-8 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Key Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <Card className="border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Mic className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">Voice-Powered Expense Tracking</h3>
                <p className="text-muted-foreground text-sm">
                  Add expenses using our AI-powered voice recognition. No manual entry needed!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">AI-Powered Analysis</h3>
                <p className="text-muted-foreground text-sm">
                  Get personalized insights and be better prepared for your financial future.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <GamepadIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">Financial Simulations</h3>
                <p className="text-muted-foreground text-sm">
                  Learn through simulated real-world scenarios to make better financial decisions.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Sponsor Banner */}
      <section className="bg-muted py-10 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-2">Partner with Us</h2>
          <p className="mb-4 text-muted-foreground">
            Interested in reaching budget-conscious college students? Become a sponsor.
          </p>
          <Button variant="outline" className="flex items-center mx-auto">
            <Mail className="mr-2 h-4 w-4" />
            <a href="mailto:sponsors@reckon.edu">sponsors@reckon.edu</a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-6 px-4 border-t">
        <div className="container max-w-4xl mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Reckon. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
