import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useFormContext } from "@cipher-health/form";
import { CustomPageContainer } from "@/components/CustomPage";



export default function ProfileContainer({ children }: { children: React.ReactNode }) {

  const { onSubmit } = useFormContext()

  return <CustomPageContainer sx={{ minWidth: 400 }}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Typography variant="h6">Création de votre profile</Typography>
      <Typography variant="body2" color="GrayText">
        Pour terminer la configuration de votre compte, veuillez renseigner les champs suivant.
      </Typography>

      {/* COMPONENT */}
      {children}

      <Box sx={{ mt: "15px", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="GrayText">
          0/1
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
          <Button variant="outlined">
            Précédent
          </Button>

          <Button variant="contained" onClick={onSubmit}>
            {/* {step === steps.length - 1 ? 'Terminer' : 'Suivant'} */}
            Suivant
          </Button>
        </Box>

      </Box>
    </LocalizationProvider>
  </CustomPageContainer>
}