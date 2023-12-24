import { ResourceProps } from "react-admin";
import AdminList from "./AdminList";
import AdminShow from "./AdminShow";


export const adminResource: ResourceProps = {
  name: 'admin',
  hasShow: true,
  options: {
    label: 'Administrateurs'
  },
  show: AdminShow,
  list: AdminList,
}