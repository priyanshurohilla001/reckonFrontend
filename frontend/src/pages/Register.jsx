import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import  toast  from "@/components/ui/sonner";
import { Loader2, ArrowLeft, Check, ChevronsUpDown, Rupee } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Popular Indian colleges and institutions
const COLLEGES = [
  "IIT Delhi",
  "IIT Bombay",
  "IIT Madras",
  "IIT Kanpur",
  "IIT Kharagpur",
  "IIT Roorkee",
  "IIT Guwahati",
  "BITS Pilani",
  "Delhi Technological University",
  "Netaji Subhas University of Technology",
  "NIT Trichy",
  "NIT Warangal",
  "NIT Surathkal",
  "VIT Vellore",
  "Manipal Institute of Technology",
  "Anna University",
  "Delhi University",
  "Jadavpur University",
  "Jamia Millia Islamia",
  "University of Mumbai",
  "St. Stephen's College",
  "Lady Shri Ram College",
  "Christ University",
  "Loyola College",
];

// Popular courses in Indian colleges
const COURSES = [
  "B.Tech Computer Science",
  "B.Tech Electronics & Communication",
  "B.Tech Mechanical Engineering",
  "B.Tech Electrical Engineering",
  "B.Tech Civil Engineering",
  "BBA",
  "B.Com",
  "B.Com (Hons)",
  "BCA",
  "BSc Computer Science",
  "BSc Physics",
  "BSc Chemistry",
  "BSc Mathematics",
  "BA Economics",
  "BA English",
  "BA Psychology",
  "BA Political Science",
  "BA Sociology",
  "B.Arch",
  "B.Des",
  "Other",
];

const userSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
    age: z
      .number()
      .int()
      .min(16, "You must be at least 16 years old")
      .max(30, "Age cannot exceed 30 for student accounts"),
    gender: z.enum(["Male", "Female", "Other"]),
    college: z.string().min(2, "Please select or enter your college name"),
    course: z.string().min(2, "Please select or enter your course"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function Register() {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(25);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    age: "",
    gender: "",
    college: "",
    course: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (step === 2) {
      setFormData((prev) => ({ ...prev, email }));
    }
  }, [step, email]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    // Set progress based on step
    if (step === 1) setProgress(25);
    else if (step === 2) setProgress(50);
    else if (step === 3) setProgress(75);
    else setProgress(100);
  }, [step]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "age") {
      setFormData({ ...formData, [name]: parseInt(value) || "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear the error for the field being updated
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });

    // Clear the error for the field being updated
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const sendOTP = async (e) => {
    e.preventDefault();

    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    }

    if (!z.string().email().safeParse(email).success) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    setIsLoading(true);

    try {
      // Check if email already exists
      const checkResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/check-email`,
        { email }
      );

      if (checkResponse.data.exists) {
        setErrors({ email: "Email already registered. Please login instead." });
        setIsLoading(false);
        return;
      }

      // Send OTP
      await axios.post(`${import.meta.env.VITE_API_URL}/api/otp/send`, {
        email,
      });
      setOtpSent(true);
      setCountdown(60);
      toast({
        title: "OTP Sent",
        description: "A verification code has been sent to your email",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to send OTP",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      setErrors({ otp: "Please enter a valid 6-digit OTP" });
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/otp/verify`, {
        email,
        otp,
      });
      nextStep();
      toast({
        title: "Email Verified",
        description: "Your email has been successfully verified",
      });
    } catch (error) {
      console.error("Error:", error);
      setErrors({ otp: error.response?.data?.message || "Invalid OTP" });
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: error.response?.data?.message || "Invalid OTP",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateCurrentStep = () => {
    try {
      if (step === 2) {
        // Validate personal details
        const personalSchema = z.object({
          name: z.string().min(2, "Name must be at least 2 characters"),
          age: z
            .number()
            .int()
            .min(16, "You must be at least 16 years old")
            .max(30, "Age cannot exceed 30 for student accounts"),
          gender: z.enum(["Male", "Female", "Other"], {
            required_error: "Please select your gender",
          }),
          phoneNumber: z
            .string()
            .regex(
              /^[6-9]\d{9}$/,
              "Enter a valid 10-digit Indian mobile number"
            ),
        });

        personalSchema.parse({
          name: formData.name,
          age: formData.age,
          gender: formData.gender,
          phoneNumber: formData.phoneNumber,
        });
      } else if (step === 3) {
        // Validate academic details
        const academicSchema = z.object({
          college: z
            .string()
            .min(2, "Please select or enter your college name"),
          course: z.string().min(2, "Please select or enter your course"),
        });

        academicSchema.parse({
          college: formData.college,
          course: formData.course,
        });
      }

      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const nextStep = () => {
    if (step === 1 || validateCurrentStep()) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate entire form
      userSchema.parse(formData);

      setIsLoading(true);

      // Submit registration
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/register`,
        {
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          age: formData.age,
          gender: formData.gender,
          college: formData.college,
          course: formData.course,
          password: formData.password,
        }
      );

      // Handle successful registration
      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully",
      });

      // Store token and redirect to dashboard
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error);

      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      } else {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: error.response?.data?.message || "Something went wrong",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailVerification = () => (
    <>
      <CardContent className="space-y-4">
        <div className="text-center mb-6">
          <Rupee className="h-12 w-12 text-primary mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-primary">Reckon</h1>
          <p className="text-muted-foreground text-sm">
            India's smart financial companion for students
          </p>
        </div>

        {!otpSent ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium">
                College Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="yourname@college.ac.in"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                className={
                  errors.email ? "border-red-500 focus:ring-red-500" : ""
                }
                required
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
              <p className="text-xs text-muted-foreground">
                We recommend using your college email for exclusive student
                benefits
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg bg-primary/10 p-4 text-center">
              <h4 className="font-medium text-primary mb-2">OTP Sent!</h4>
              <p className="text-sm text-muted-foreground">
                A 6-digit verification code has been sent to {email}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="otp" className="font-medium">
                Enter 6-digit OTP
              </Label>
              <Input
                id="otp"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                  if (errors.otp) setErrors({ ...errors, otp: undefined });
                }}
                placeholder="• • • • • •"
                className={`text-center text-lg font-medium tracking-widest ${
                  errors.otp ? "border-red-500 focus:ring-red-500" : ""
                }`}
                maxLength={6}
                required
                ref={inputRef}
              />
              {errors.otp && (
                <p className="text-xs text-red-500 mt-1">{errors.otp}</p>
              )}
              <div className="flex justify-between items-center text-xs">
                <p className="text-muted-foreground">
                  {countdown > 0 ? `Resend OTP in ${countdown}s` : ""}
                </p>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto"
                  disabled={countdown > 0}
                  onClick={(e) => {
                    e.preventDefault();
                    sendOTP(e);
                  }}
                >
                  {countdown > 0 ? "" : "Resend OTP"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!otpSent ? (
          <Button className="w-full" onClick={sendOTP} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending OTP...
              </>
            ) : (
              "Get OTP"
            )}
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={verifyOTP}
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify & Continue"
            )}
          </Button>
        )}
      </CardFooter>
    </>
  );

  const renderPersonalDetails = () => (
    <>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Rahul Sharma"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "border-red-500 focus:ring-red-500" : ""}
              required
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              name="age"
              type="number"
              placeholder="19"
              value={formData.age}
              onChange={handleChange}
              className={errors.age ? "border-red-500 focus:ring-red-500" : ""}
              required
            />
            {errors.age && (
              <p className="text-xs text-red-500 mt-1">{errors.age}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              name="gender"
              onValueChange={(value) => handleSelectChange("gender", value)}
              value={formData.gender}
            >
              <SelectTrigger
                className={
                  errors.gender ? "border-red-500 focus:ring-red-500" : ""
                }
              >
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-xs text-red-500 mt-1">{errors.gender}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Mobile Number</Label>
            <div className="flex">
              <div className="flex items-center justify-center px-3 border border-r-0 rounded-l-md border-input bg-muted">
                +91
              </div>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                className={`rounded-l-none ${
                  errors.phoneNumber ? "border-red-500 focus:ring-red-500" : ""
                }`}
                placeholder="9876543210"
                maxLength={10}
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-xs text-red-500 mt-1">{errors.phoneNumber}</p>
            )}
            <p className="text-xs text-muted-foreground">
              We'll send important updates to this number
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={nextStep} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Next"
          )}
        </Button>
      </CardFooter>
    </>
  );

  const renderAcademicDetails = () => (
    <>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="college">College/University</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={`w-full justify-between text-left font-normal ${
                  errors.college ? "border-red-500 focus:ring-red-500" : ""
                }`}
              >
                {formData.college
                  ? formData.college
                  : "Select your institution"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search for your college..." />
                <CommandEmpty>
                  No college found. You can type your college name.
                </CommandEmpty>
                <CommandGroup className="max-h-64 overflow-y-auto">
                  {COLLEGES.map((college) => (
                    <CommandItem
                      key={college}
                      value={college}
                      onSelect={() => {
                        handleSelectChange("college", college);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          formData.college === college
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {college}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          {errors.college && (
            <p className="text-xs text-red-500 mt-1">{errors.college}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Don't see your college? Just type it in the search box.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="course">Course</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={`w-full justify-between text-left font-normal ${
                  errors.course ? "border-red-500 focus:ring-red-500" : ""
                }`}
              >
                {formData.course ? formData.course : "Select your course"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search for your course..." />
                <CommandEmpty>
                  No course found. You can type your course name.
                </CommandEmpty>
                <CommandGroup className="max-h-64 overflow-y-auto">
                  {COURSES.map((course) => (
                    <CommandItem
                      key={course}
                      value={course}
                      onSelect={() => {
                        handleSelectChange("course", course);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          formData.course === course
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {course}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          {errors.course && (
            <p className="text-xs text-red-500 mt-1">{errors.course}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={nextStep}>Next</Button>
      </CardFooter>
    </>
  );

  const renderPasswordSetup = () => (
    <>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">Create Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            className={
              errors.password ? "border-red-500 focus:ring-red-500" : ""
            }
            required
          />
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password}</p>
          )}

          <div className="grid grid-cols-3 gap-2 mt-2">
            <div
              className={`h-1 rounded-full ${
                formData.password.length >= 8 ? "bg-green-500" : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`h-1 rounded-full ${
                /[A-Z]/.test(formData.password) &&
                /[0-9]/.test(formData.password)
                  ? "bg-green-500"
                  : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`h-1 rounded-full ${
                /[^A-Za-z0-9]/.test(formData.password)
                  ? "bg-green-500"
                  : "bg-gray-200"
              }`}
            ></div>
          </div>

          <ul className="text-xs text-muted-foreground space-y-1 mt-2">
            <li
              className={formData.password.length >= 8 ? "text-green-600" : ""}
            >
              ✓ At least 8 characters
            </li>
            <li
              className={
                /[A-Z]/.test(formData.password) &&
                /[0-9]/.test(formData.password)
                  ? "text-green-600"
                  : ""
              }
            >
              ✓ Uppercase letter and number
            </li>
            <li
              className={
                /[^A-Za-z0-9]/.test(formData.password) ? "text-green-600" : ""
              }
            >
              ✓ Special character (!@#$%^&*)
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={
              errors.confirmPassword ? "border-red-500 focus:ring-red-500" : ""
            }
            required
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <Alert className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-xs text-amber-700">
            Make sure to use a strong, unique password that you don't use
            elsewhere
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </CardFooter>
    </>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 py-8 px-4">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <div className="relative mb-2">
              <Progress value={progress} className="h-1" />
            </div>
            <CardTitle className="text-2xl">
              {step === 1 && "Verify Email"}
              {step === 2 && "Personal Details"}
              {step === 3 && "Academic Information"}
              {step === 4 && "Set Password"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Let's start with your email verification"}
              {step === 2 && "Tell us a bit about yourself"}
              {step === 3 && "Your educational background"}
              {step === 4 && "Create a secure password for your account"}
            </CardDescription>
          </CardHeader>

          {step === 1 && renderEmailVerification()}
          {step === 2 && renderPersonalDetails()}
          {step === 3 && renderAcademicDetails()}
          {step === 4 && renderPasswordSetup()}

          <div className="px-6 pb-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
