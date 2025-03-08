import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from '../contexts/AuthContext';

const serverUrl = import.meta.env.VITE_SERVER_URL;

// Login form validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required")
});

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear field-specific error when user makes changes
    if (errors[name]) {
      setErrors(prev => ({...prev, [name]: undefined}));
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Clear previous errors
      setErrors({});
      
      // Validate form data
      const result = loginSchema.safeParse(formData);
      if (!result.success) {
        const formattedErrors = {};
        result.error.errors.forEach(err => {
          formattedErrors[err.path[0]] = err.message;
        });
        
        setErrors(formattedErrors);
        const firstError = result.error.errors[0];
        toast.error(firstError.message);
        return;
      }

      setIsLoading(true);
      const response = await axios.post(`${serverUrl}/api/users/login`, formData);
      
      if (response.data.success) {
        // Store JWT token
        localStorage.setItem("token", response.data.token);
        
        // Update auth context
        login(response.data.user);
        
        toast.success(response.data.message || "Login successful!");
        
        // Navigate to dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response?.data?.field) {
        // Handle field-specific error
        setErrors({ [error.response.data.field]: error.response.data.message });
        toast.error(error.response.data.message);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-violet-50 to-indigo-100">
      <Card className="w-full max-w-md border-none shadow-xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-2xl bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent font-bold">
              Welcome Back
            </CardTitle>
          </div>
          <CardDescription>
            Login to your Campus Cash account
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@university.edu"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                required
              />
              {errors.email && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.email}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                required
              />
              {errors.password && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.password}
                </p>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging In...
                </>
              ) : "Login"}
            </Button>
            
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Sign Up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
