import { getMinimalMajorBirthDate } from "@cipher-health/utils";
import { z } from "zod";

export const profileCreationSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  address: z.string(),
  addressDetails: z.string().optional(),
  city: z.string(),
  zipCode: z.string().regex(/^\d{5}$/),
  country: z.string().length(2), // FR, US, etc.
  birthDate: z.coerce.date().max(getMinimalMajorBirthDate()),
  // TODO: add dyanmic logic to require birthPlace on "CLIENT" type of user
  // birthPlace: z.string(), 
  birthName: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE'])
})