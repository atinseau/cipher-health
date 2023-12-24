/* eslint-disable react/jsx-key */

import {
  List,
  Datagrid,
  TextField,
  TopToolbar,
  CreateButton,
  ExportButton,
  ShowButton,
} from 'react-admin';

const ListActions = () => {
  return <TopToolbar>
    <CreateButton />
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