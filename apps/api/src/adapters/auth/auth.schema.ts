import {
  COUNTRIES,
  regexContainLowerCaseLetters,
  regexContainNumbers,
  regexContainSpecialChar,
  regexContainUpperCaseLetters,
} from "@cipher-health/utils";
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
    .regex(regexContainLowerCaseLetters, 'Password must contain at least one lowercase letter')
    .regex(regexContainUpperCaseLetters, 'Password must contain at least one uppercase letter')
    .regex(regexContainNumbers, 'Password must contain at least one number')
    .regex(regexContainSpecialChar, 'Password must contain at least one special character')
    .min(8, 'Password is too short - should be 8 chars minimum.'),
  confirmPassword: z.string(),
  phone: z.string(),
  country: z.string().refine((country) => {
    return COUNTRIES.some((c) => c.code === country)
  }, {
    message: 'Invalid country'
  })
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
  });

export const signinSchema = z.object({
  email: z
    .string()
    .email(),
  password: z
    .string()
    .min(8, 'Password is too short - should be 8 chars minimum.')
    .max(50, 'Password is too long - should be 50 chars maximum.'),
})