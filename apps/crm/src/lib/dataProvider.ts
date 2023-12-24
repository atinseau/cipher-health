import { DataProvider, GetListParams, GetListResult, GetOneParams, GetOneResult } from "react-admin";
import { getAdminList } from "../resources/AdminResource/queries/getList";
import { getAdminOne } from "../resources/AdminResource/queries/getOne";

async function getList(resource: string, params: GetListParams): Promise<GetListResult> {
  switch (resource) {
    case 'admin':
      return getAdminList(params)
    default:
      return {
        data: [],
        total: 0
      }
  }
}

async function getOne(resource: string, params: GetOneParams): Promise<GetOneResult> {
  switch (resource) {
    case 'admin':
      return getAdminOne(params)
    default:
      return {
        data: {
          id: 'ok'
        }
      }
  }

}

// @ts-ignore
export const dataProvider: DataProvider = {
  getList,
  getOne,
}