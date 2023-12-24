import { GetOneParams, GetOneResult } from "react-admin"
import { authentificator } from "../../../auth"
import type { UserModel } from "@cipher-health/sdk"

const client = authentificator.getClient()

export async function getAdminOne(params: GetOneParams): Promise<GetOneResult> {

  const [res, error] = await client.get<{ data: UserModel }>({
    endpoint: '/admin/' + params.id,
  })

  console.log(error)

  return {
    data: {
      id: "53c2b6c9-be05-4693-91ab-bad8939cfd82",
      fullName: 'Admin Admin',
      email: 'arthurtweak@gmail.com',
      permissions: []
    }
  }


}