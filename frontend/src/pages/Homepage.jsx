import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowRight, Mic, Activity, BookOpen, Mail, 
  BadgeIndianRupee, TrendingUp, ShieldCheck, Lightbulb
} from "lucide-react";

export default function Homepage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in by looking for token
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section - Updated with Indian theme */}
      <section className="bg-gradient-to-b from-primary/10 via-amber-50/30 to-background py-16 px-4 md:py-24 text-center">
        <div className="container max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <BadgeIndianRupee size={42} className="text-primary" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-primary">Paisa</span> Smart, Future Bright
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            India's first financial companion designed for college students across the nation
          </p>
          
          {/* CTA buttons - Enhanced styling */}
          <div className="space-x-4">
            {isLoggedIn ? (
              <Button size="lg" className="px-6 py-6 text-base" asChild>
                <Link to="/dashboard" className="flex items-center">
                  Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <>
                <Button size="lg" className="px-6 py-6 text-base" asChild>
                  <Link to="/login">Log In</Link>
                </Button>
                <Button size="lg" variant="outline" className="px-6 py-6 text-base" asChild>
                  <Link to="/register">Join Now</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Updated educational disclaimer */}
      <div className="container max-w-4xl mx-auto px-4 py-4">
        <Alert className="bg-amber-50 border border-amber-200">
          <AlertDescription className="text-center text-sm py-1">
            Designed for Indian students from IITs, NITs, and universities nationwide. 
            All features are tailored for educational financial literacy.
          </AlertDescription>
        </Alert>
      </div>

      {/* Why Choose Reckon - New section */}
      <section className="container max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">Why Choose Reckon?</h2>
        <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
          Built by students from IIT Delhi, Reckon understands the unique financial challenges faced by Indian college students
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="bg-green-100 p-2 rounded-full mt-1">
                <BadgeIndianRupee className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Rupee-First Design</h3>
                <p className="text-muted-foreground text-sm">
                  Built specifically for the Indian currency and spending habits of Indian students
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="bg-purple-100 p-2 rounded-full mt-1">
                <Lightbulb className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">College Budget Templates</h3>
                <p className="text-muted-foreground text-sm">
                  Pre-configured budgets for hostelers, day scholars and various college situations
                </p>
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="bg-blue-100 p-2 rounded-full mt-1">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">College Expense Analytics</h3>
                <p className="text-muted-foreground text-sm">
                  Compare your spending against students from your college or similar institutions
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="bg-orange-100 p-2 rounded-full mt-1">
                <ShieldCheck className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Privacy Focused</h3>
                <p className="text-muted-foreground text-sm">
                  Your financial data never leaves our secure Indian servers
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features - Updated with more specific Indian context */}
      <section className="bg-gradient-to-b from-background to-muted/30 container max-w-4xl mx-auto px-4 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">Smart Features</h2>
        <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
          Tools designed for the unique financial journey of Indian students
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <Card className="border border-muted shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Mic className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">Hindi & English Voice Input</h3>
                <p className="text-muted-foreground text-sm">
                  Track expenses by simply speaking in Hindi or English - perfect for quick entries
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="border border-muted shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">Mess Budget Calculator</h3>
                <p className="text-muted-foreground text-sm">
                  Optimize between hostel mess, canteen and outside food expenses with our smart calculator
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="border border-muted shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">Scholarship Tracker</h3>
                <p className="text-muted-foreground text-sm">
                  Keep track of scholarship applications, deadlines and disbursements all in one place
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials - New section */}
      <section className="container max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">What Students Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-muted bg-card/50">
            <CardContent className="pt-6">
              <p className="italic text-muted-foreground mb-4">
                "As a first-year at IIT Bombay, Reckon helped me track my expenses and save enough for that tech workshop I really wanted to attend!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                  AS
                </div>
                <div className="ml-3">
                  <p className="font-medium">Aarav Sharma</p>
                  <p className="text-xs text-muted-foreground">B.Tech, IIT Bombay</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-muted bg-card/50">
            <CardContent className="pt-6">
              <p className="italic text-muted-foreground mb-4">
                "The mess budget calculator is a lifesaver! I've saved almost ₹2000 monthly by optimizing between hostel mess and outside food."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                  PN
                </div>
                <div className="ml-3">
                  <p className="font-medium">Priya Nair</p>
                  <p className="text-xs text-muted-foreground">BSc Economics, Delhi University</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Partner Banner - Updated for Indian context */}
      <section className="bg-muted py-10 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-2">Partner with Reckon</h2>
          <p className="mb-4 text-muted-foreground">
            Are you a college or financial institution interested in promoting financial literacy among Indian students?
          </p>
          <Button variant="outline" className="flex items-center mx-auto">
            <Mail className="mr-2 h-4 w-4" />
            <a href="mailto:partnerships@reckon.edu">partnerships@reckon.edu</a>
          </Button>
        </div>
      </section>

      {/* Footer - Updated with Indian college focus */}
      <footer className="mt-auto py-8 px-4 border-t">
        <div className="container max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div>
              <h3 className="font-semibold mb-3">Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/features">Budget Tools</Link></li>
                <li><Link to="/features">Expense Tracking</Link></li>
                <li><Link to="/features">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/blog">Finance Blog</Link></li>
                <li><Link to="/resources">Scholarship Guide</Link></li>
                <li><Link to="/resources">Student Discounts</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/careers">Careers</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-center pt-6 border-t border-border text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Reckon. Made with ❤️ in India. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}