import z from 'zod'
import { regexContainLowerCaseLetters } from '../containLowerCaseLetters';
import { regexContainUpperCaseLetters } from '../containUpperCaseLetters';
import { regexContainNumbers } from '../containNumbers';
import { regexContainSpecialChar } from '../containSpecialChar';
import { COUNTRIES } from '../countries';

export const signupSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .regex(regexContainLowerCaseLetters, 'Password must contain at least one lowercase letter')
    .regex(regexContainUpperCaseLetters, 'Password must contain at least one uppercase letter')
    .regex(regexContainNumbers, 'Password must contain at least one number')
    .regex(regexContainSpecialChar, 'Password must contain at least one special character')
    .min(8, 'Password is too short - should be 8 chars minimum.'),
  confirmPassword: z.string().min(1),
  phone: z.string().min(1),
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
