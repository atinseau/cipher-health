import z from "zod"

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(50),
  confirmPassword: z.string().min(8).max(50),
  firstName: z.string(),
  lastName: z.string(),
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ['confirmPassword'],
  })


