import { CreateParams, CreateResult } from "react-admin";
import { authentificator } from "../../../auth";

const client = authentificator.getClient()

export async function adminCreate(params: CreateParams): Promise<CreateResult> {

  const { data } = params

  const {
    selectedPermissions = [],
    allPermissions = false
  } = data

  const [_, error] = await client.post('/admin/invite', {
    body: {
      email: data.email,
      permissions: allPermissions
        ? ['*']
        : selectedPermissions
    }
  })

  if (error) {
    throw error
  }

  return {
    data: {
      id: true // workaround for react-admin
    }
  }
}