import { z } from "zod";

export const optionalString = z.union([
  z.string(),
  z.null(),
  z.undefined(),
]).transform((val) => {
  if (!val) return undefined
  return val
})