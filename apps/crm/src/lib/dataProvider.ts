import { DataProvider, GetListParams, GetListResult } from "react-admin";

async function getList(resource: string, params: GetListParams): Promise<GetListResult> {
  console.log(resource, params)

  return {
    data: [{ id: '1', title: "salut" }],
    total: 1
  }
}

// @ts-ignore
export const dataProvider: DataProvider = {
  getList: getList
}