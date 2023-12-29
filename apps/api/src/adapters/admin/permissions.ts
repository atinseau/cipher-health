
export const AdminPermissions = {
  INVITE: {
    name: 'invite',
    description: 'Invite new admins to the platform'
  },
  GET_PERMISSIONS: {
    name: 'get_permissions',
    description: 'Get list of permissions for admins'
  },
  ALL: {
    name: '*',
    description: 'All permissions'
  }
}

export const allPermissions = Object.values(AdminPermissions).map((permissions) => permissions.name)

export type AdminPermission = keyof typeof AdminPermissions