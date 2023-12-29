import { CreateParams, CreateResult, DataProvider, GetListParams, GetListResult, GetOneParams, GetOneResult } from "react-admin";
import { getAdminList } from "../resources/AdminResource/queries/getList";
import { getAdminOne } from "../resources/AdminResource/queries/getOne";
import { adminCreate } from "../resources/AdminResource/queries/create";

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

async function create(resource: string, params: CreateParams): Promise<CreateResult> {
  switch (resource) {
    case 'admin':
      return adminCreate(params)
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
  create,
  getOne,
}