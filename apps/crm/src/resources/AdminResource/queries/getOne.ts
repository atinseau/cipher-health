import { GetOneParams, GetOneResult } from "react-admin"

export async function getAdminOne(params: GetOneParams): Promise<GetOneResult> {

  console.log(params)

  return {
    data: {
      id: "53c2b6c9-be05-4693-91ab-bad8939cfd82",
      fullName: 'Admin Admin',
      email: 'arthurtweak@gmail.com',
      permissions: []
    }
  }


}