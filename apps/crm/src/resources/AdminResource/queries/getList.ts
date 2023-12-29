import { GetListParams, GetListResult } from "react-admin"
import { authentificator } from "../../../auth"
import { UserModel } from "@cipher-health/sdk"

const client = authentificator.getClient()

export async function getAdminList(params: GetListParams): Promise<GetListResult> {

  const [res, error] = await client.get<{ data: UserModel[] }>('/admin/all', {
    query: {
      page: params.pagination.page,
      perPage: params.pagination.perPage,
      sort: params.sort.field,
      order: params.sort.order
    }
  })

  if (error || !res) {
    console.error(error)
    return {
      data: [],
      total: 0
    }
  }

  const { data } = res

  return {
    data: data.map((user) => ({
      id: user.id,
      fullName: `${user.profile?.firstName} ${user.profile?.lastName}`,
      email: user.email,
      permissions: user.admin?.permissions || []
    })),
    total: data.length
  }
}