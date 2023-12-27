import { CustomRoutes, Resource, ResourceProps } from "react-admin";
import AdminList from "./components/List";
import AdminShow from "./components/Show";
import AdminCreate from "./components/Create";

import { Route } from "react-router-dom";
import AdminSignup from "./components/Signup/Signup";

export const config: ResourceProps = {
  name: 'admin',
  options: {
    label: 'Administrateurs'
  },
  show: AdminShow,
  create: AdminCreate,
  list: AdminList,
}

export const adminResource = <>
  <Resource {...config} />
  <CustomRoutes noLayout>
    <Route path="/admin/signup" Component={AdminSignup} />
  </CustomRoutes>
</>