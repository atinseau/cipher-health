import { z } from "zod";
import { informationSchema, addressSchema } from '@cipher-health/utils/schemas'

export const profileCreationSchema = z.object({})
  .merge(informationSchema)
  .merge(addressSchema)
