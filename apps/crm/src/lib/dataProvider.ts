import { DataProvider, GetListParams, GetListResult } from "react-admin";
import { getAdminListResult } from "../resources/AdminResource/adminListResult";

async function getList(resource: string, params: GetListParams): Promise<GetListResult> {
  switch (resource) {
    case 'admin':
      return getAdminListResult(params)
    default:
      return {
        data: [],
        total: 0
      }
  }
}

// @ts-ignore
export const dataProvider: DataProvider = {
  getList: getList
}