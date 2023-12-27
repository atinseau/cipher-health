import { z } from "zod";

export const inviteAdminSchema = z.object({
  email: z.string().email()
})