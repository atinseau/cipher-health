
import { List, Datagrid, TextField } from 'react-admin';

export default function AdminList() {
  return <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="title" />
    </Datagrid>
  </List>
}