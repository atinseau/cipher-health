import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(50),
  confirmPassword: z.string(),
  firstName: z.string(),
  lastName: z.string(),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // path of error
});

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(50),
})