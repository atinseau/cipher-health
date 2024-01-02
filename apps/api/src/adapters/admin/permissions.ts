
export const AdminPermissions = {
  ALL: {
    name: '*',
    description: 'All permissions'
  }
}

export const allPermissions = Object.values(AdminPermissions).map((permissions) => permissions.name)

export type AdminPermission = keyof typeof AdminPermissions