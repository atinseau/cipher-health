import { z } from "zod";
import { optionalString } from "./helpers";

export const addressSchema = z.object({
  address: z.string().min(1),
  zipCode: z.string().regex(/^\d{5}$/),
  addressDetails: optionalString,
  city: z.string().min(1),
  country: z.string().min(1),
})