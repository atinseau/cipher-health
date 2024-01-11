import { z } from "zod";

/**
 * Has minimum 8 characters in length. Adjust it by modifying {8,}
 * At least one uppercase English letter. You can remove this condition by removing (?=.*?[A-Z])
 * At least one lowercase English letter.  You can remove this condition by removing (?=.*?[a-z])
 * At least one digit. You can remove this condition by removing (?=.*?[0-9])
 * At least one special character,  You can remove this condition by removing (?=.*?[#?!@$%.^&*-])
 */
export { signupSchema } from "@cipher-health/utils/schemas";


export const signinSchema = z.object({
  email: z
    .string()
    .email(),
  password: z
    .string()
    .min(8, 'Password is too short - should be 8 chars minimum.')
    .max(50, 'Password is too long - should be 50 chars maximum.'),
})