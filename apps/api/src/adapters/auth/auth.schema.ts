import { z } from "zod";

/**
 * Has minimum 8 characters in length. Adjust it by modifying {8,}
 * At least one uppercase English letter. You can remove this condition by removing (?=.*?[A-Z])
 * At least one lowercase English letter.  You can remove this condition by removing (?=.*?[a-z])
 * At least one digit. You can remove this condition by removing (?=.*?[0-9])
 * At least one special character,  You can remove this condition by removing (?=.*?[#?!@$%.^&*-])
 */
export const signupSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?.!@$%^&*-]).{8,}$/, {
      message: 'Password is too weak, it should contain at least 8 characters, one uppercase, one lowercase, one number and one special character (#?!@$%.^&*-)'
    }),
  confirmPassword: z.string(),
  phone: z.string(), // TODO: add phone validation, enforce international phone numbers only (E.164)
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // path of error
});

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(50),
})