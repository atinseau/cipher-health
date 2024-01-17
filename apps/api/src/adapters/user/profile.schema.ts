import { getMinimalMajorBirthDate } from "@cipher-health/utils";
import { z } from "zod";

export const profileCreationSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  address: z.string().min(1),
  addressDetails: z.string().min(1).optional(),
  city: z.string().min(1),
  zipCode: z.string().regex(/^\d{5}$/),
  country: z.string(),
  birthDate: z.coerce.date().max(getMinimalMajorBirthDate()),
  birthPlace: z.string().min(1).optional(),
  birthName: z.string().min(1).optional(),
  gender: z.enum(['MALE', 'FEMALE'])
})