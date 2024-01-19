import { z } from "zod";
import { getMinimalMajorBirthDate } from "../getMinimalMajorBirthDate";
import { optionalString } from "./helpers";

export const informationSchema = z.object({
  gender: z.enum(['MALE', 'FEMALE']),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  birthDate: z
    .string()
    .min(1)
    .pipe(z.coerce.date().max(getMinimalMajorBirthDate(), {
      message: "Vous devez être majeur"
    }))
    .transform((date) => date.toISOString()),
  birthPlace: z.string().min(1),
  birthName: optionalString,
})