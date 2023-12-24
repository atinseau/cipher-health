import { Show, SimpleShowLayout, TextField, useRecordContext } from "react-admin";

const AdminTitle = () => {
  const admin = useRecordContext();
  return <span>{admin ? `${admin.fullName}` : ''}</span>

}

export default function AdminShow() {
  return <Show title={<AdminTitle/>}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="fullName" label="Nom complet" />
    </SimpleShowLayout>
  </Show>
}