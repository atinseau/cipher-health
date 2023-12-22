import { GetListParams, GetListResult } from "react-admin"
import { authentificator } from "../../auth"
import { UserModel } from "@cipher-health/api"

const client = authentificator.getClient()

export async function getAdminListResult(params: GetListParams): Promise<GetListResult> {
  
  const [res, error] = await client.get<{ data: UserModel[] }>({
    endpoint: '/admin/all',
    params: {
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

  console.log(data)
  
  return {
    data: [{ id: '1', title: "salut" }],
    total: 1
  }
}