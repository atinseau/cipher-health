import {
  List,
  Datagrid,
  TextField,
  TopToolbar,
  CreateButton,
  ExportButton,
  ShowButton,
  usePermissions,
} from 'react-admin';

const ListActions = () => {
  const { permissions, isLoading } = usePermissions<string[] | undefined>()

  return <TopToolbar>
    {!isLoading && permissions && permissions.includes('*') && <CreateButton />}
    <ExportButton />
  </TopToolbar>
}

export default function AdminList() {
  return <List actions={<ListActions />}>
    <Datagrid>
      <TextField
        source="fullName"
        label="Nom complet"
      />
      <TextField source="email" />
      <>
        {/* <EditButton /> <--- enable it when roles will be supported in the backend side */}
        <ShowButton />
      </>
    </Datagrid>
  </List>
}