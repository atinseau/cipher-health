import { z } from "zod";
import { socialSecurityRegex } from "../socialSecurityRegex";

export const clientMedicalInformationSchema = z.object({
  socialSecurityNumber: z.union([
    z.string().regex(socialSecurityRegex),
    z.string().length(0)
  ]),
  mutualInsuranceNumber: z.string().optional(),
})