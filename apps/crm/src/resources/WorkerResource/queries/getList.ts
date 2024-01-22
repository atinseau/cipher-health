import { GetListParams, GetListResult } from "react-admin"

export async function getAdminList(params: GetListParams): Promise<GetListResult> {
  return {
    data: [],
    total: 0
  }
}