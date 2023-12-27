import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Create, SimpleForm, TextInput } from "react-admin";

export default function AdminCreate() {
  return <Create title="Inviter des administrateurs">
    <SimpleForm>
      <Box mb={"10px"}>
        <Typography variant="h6">Email de l{"'"}utilisateur</Typography>
        <Typography variant="body2" color="GrayText">l{"'"}utilisateur recevra un email avec un lien pour créer son compte.</Typography>
      </Box>
      <TextInput source="email" label="Adresse email" type="email" required fullWidth />
    </SimpleForm>
  </Create>
}