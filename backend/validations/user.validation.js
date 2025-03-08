import { z } from "zod";

export const registerUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().int().min(16, "Age must be at least 16").max(100, "Age must be less than 100"),
  gender: z.enum(["Male", "Female", "Other"], { errorMap: () => ({ message: "Please select a gender" }) }),
  course: z.string().min(2, "Course name is required"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Include at least one uppercase letter")
    .regex(/[0-9]/, "Include at least one number")
    .regex(/[^A-Za-z0-9]/, "Include at least one special character"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  college: z.string().min(2, "College name is required"),
  tags: z.array(z.string()).optional(),
  otp: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export const loginUserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required")
});
