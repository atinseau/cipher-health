import { z } from "zod";
import { AdminPermissions, allPermissions } from "./permissions";

export const inviteAdminSchema = z.object({
  email: z.string().email(),
  permissions: z.string().array().refine((permissions) => {
    return permissions.every((permission) => allPermissions.includes(permission))
  })
})