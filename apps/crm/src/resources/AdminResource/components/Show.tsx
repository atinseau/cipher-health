import { ChipField, Identifier, RaRecord, Show, SimpleShowLayout, TextField, useRecordContext } from "react-admin";

const AdminTitle = ({ admin }: { admin: RaRecord<Identifier> }) => {
  return <span>{admin ? `${admin.fullName}` : ''}</span>

}

export default function AdminShow() {

  const admin = useRecordContext();

  return <Show title={<AdminTitle admin={admin} />}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="fullName" label="Nom complet" />
      {admin && admin.profile.permissions.length > 0 && <ChipField source="permissions" label="Permissions" />}
    </SimpleShowLayout>
  </Show>
}