import { ResourceProps } from "react-admin";
import AdminList from "./components/List";
import AdminShow from "./components/Show";


export const adminResource: ResourceProps = {
  name: 'admin',
  hasShow: true,
  options: {
    label: 'Administrateurs'
  },
  show: AdminShow,
  list: AdminList,
}