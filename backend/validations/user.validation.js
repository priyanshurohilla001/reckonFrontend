import { z } from "zod";

export const registerUserSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  age: z.number().int().positive({ message: "Age must be a positive number" }),
  gender: z.enum(["Male", "Female", "Other"], {
    message: "Gender must be Male, Female or Other",
  }),
  course: z.string().min(1, { message: "Course is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.string().regex(/^\d{10}$/, {
    message: "Phone number must be 10 digits",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
  college: z.string().min(1, { message: "College name is required" }),
  tags: z.array(z.string()).optional().default([]),
  // rest of the schema
});
