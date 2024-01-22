import {
  List,
  Datagrid,
  TextField,
  TopToolbar,
  ExportButton,
  ShowButton,
} from 'react-admin';

const ListActions = () => {
  return <TopToolbar>
    <ExportButton />
  </TopToolbar>
}

export default function WorkerList() {
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