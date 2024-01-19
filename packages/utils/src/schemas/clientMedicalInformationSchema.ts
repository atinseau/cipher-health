import { z } from "zod";
import { socialSecurityRegex } from "../socialSecurityRegex";
import { optionalString } from "./helpers";

export const clientMedicalInformationSchema = z.object({
  socialSecurityNumber: z.union([
    z.string().regex(socialSecurityRegex),
    z.null(),
    z.undefined(),
    z.string().length(0)
  ]).transform((val) => {
    if (!val) return undefined
    return val
  }),
  mutualInsuranceNumber: optionalString,
})