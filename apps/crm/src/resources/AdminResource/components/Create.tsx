import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Create, SimpleForm, TextInput, useNotify, usePermissions, useRedirect } from "react-admin";
import { authentificator } from "../../../auth";
import { useCallback, useEffect, useState } from "react";
import { BooleanInput } from 'react-admin';
import Switch from '@mui/material/Switch'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useController } from 'react-hook-form';


const client = authentificator.getClient()

const PermissionInput = ({ permissions }) => {

  const [allPermissions, setAllPermissions] = useState(false)
  const [selectedPermissions, setSelectedPermissions] = useState([])

  const allPermissionsController = useController({
    name: 'allPermissions',
    defaultValue: false
  })

  const selectedPermissionsController = useController({
    name: 'selectedPermissions',
    defaultValue: []
  })


  const handlePermissionChange = useCallback((permission, e) => {
    const nextSelectedPermissions = e.target.checked
      ? [...selectedPermissions, permission.name]
      : selectedPermissions.filter((p) => p !== permission.name)

    setSelectedPermissions(nextSelectedPermissions)
    selectedPermissionsController.field.onChange(nextSelectedPermissions)
  }, [selectedPermissions])

  // When allPermissions is true, we reset all the previously selected permissions
  const handleAllPermissionsToggle = useCallback((e) => {
    const isChecked = e.target.checked
    if (isChecked) {
      setSelectedPermissions([])
      selectedPermissionsController.field.onChange([])
    }
    setAllPermissions(isChecked)
    allPermissionsController.field.onChange(isChecked)
  }, [])

  return <Box mb={"10px"}>
    <Typography variant="h6">Permissions</Typography>
    <Typography variant="body2" color="GrayText">
      Les permissions permettent de définir les actions que l{"'"}utilisateur peut faire sur l{"'"}application.
      Vous pouvez en cocher plusieurs. Si vous ne cochez aucune permission, l{"'"}utilisateur ne pourra rien faire. (elles pourront etre modifié plus tard).
      Si vous souhaitez lui donner toutes les permissions, cochez la case ci-dessous.
    </Typography>

    <FormGroup sx={{ mt: "10px" }}>
      <FormControlLabel control={<Switch checked={allPermissions} onChange={handleAllPermissionsToggle} />} label="Toutes les permissions" />
    </FormGroup>

    {permissions.length > 0 && <Box mt={"10px"} sx={{ display: "flex", flexDirection: 'column' }}>
      <Typography variant="body2" color="GrayText" mb="8px">
        Ou sélectionnez les permissions que vous souhaitez donner à l{"'"}utilisateur :
      </Typography>

      <FormGroup>
        {permissions.map((permission) => <FormControlLabel
          key={permission.name}
          disabled={allPermissions}
          sx={{ width: 'fit-content' }}
          control={<Switch
            checked={selectedPermissions.includes(permission.name)}
            onChange={handlePermissionChange.bind(null, permission)}
          />}
          label={permission.description} />)}
      </FormGroup>
    </Box>}
  </Box>
}

export default function AdminCreate() {

  const [permissions, setPermissions] = useState([])
  const notify = useNotify()
  const redirect = useRedirect()

  useEffect(() => {
    if (permissions.length > 0) return
    client.get('/admin/permissions').then(([res, data]) => {
      setPermissions(res?.data?.filter((p) => p.name !== '*') || [])
    })
  }, [])



  return <Create
    title="Inviter des administrateurs"
    mutationOptions={{
      onError: (error) => {
        if (error.status === 403) {
          notify("Vous n'avez pas les permissions pour effectuer cette action", {
            type: 'error'
          })
          return
        }
        // parse the error
        notify("Une erreur est survenue lors de l'envoi de l'invitation, contactez l'équipe de développement", {
          type: 'error'
        })
      },
      onSuccess: ({ data }) => {
        console.log('data:', data)
        notify('Invitation envoyée avec succès !', {
          type: 'success'
        })
        redirect('/admin/list')
      }
    }}
  >
    <SimpleForm>
      <Box mb={"10px"}>
        <Typography variant="h6">Email de l{"'"}utilisateur</Typography>
        <Typography variant="body2" color="GrayText">l{"'"}utilisateur recevra un email avec un lien pour créer son compte.</Typography>
      </Box>
      <TextInput source="email" label="Adresse email" type="email" required fullWidth />
      <PermissionInput permissions={permissions} />
    </SimpleForm>
  </Create>
}