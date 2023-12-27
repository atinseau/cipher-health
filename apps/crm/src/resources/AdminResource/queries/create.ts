import { CreateParams, CreateResult } from "react-admin";


export async function adminCreate(resource: string, params: CreateParams): Promise<CreateResult> {

  console.log(resource, params)
  
}