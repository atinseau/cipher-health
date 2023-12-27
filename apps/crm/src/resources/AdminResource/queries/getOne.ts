import { GetOneParams, GetOneResult } from "react-admin"
import { authentificator } from "../../../auth"
import type { UserModel } from "@cipher-health/sdk"

const client = authentificator.getClient()

export async function getAdminOne(params: GetOneParams): Promise<GetOneResult> {

  const [res, error] = await client.get<{ data: UserModel }>('/admin/' + params.id)

  if (error) {
    throw error
  }
  
  return {
    data: {
      id: res.data.id,
      fullName: `${res.data.profile?.firstName} ${res.data.profile?.lastName}`,
      email: res.data.email,
      permissions: res.data.admin?.permissions || [],
    }
  }


}