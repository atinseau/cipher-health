import { ResourceProps } from "react-admin";
import AdminList from "./AdminList";


export const adminResource: ResourceProps = {
  name: 'admin',
  list: AdminList,
}