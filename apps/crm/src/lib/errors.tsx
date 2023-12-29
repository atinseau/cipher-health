import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

export const invalidLinkError = <Alert variant="filled" severity="error">
  <Typography variant="body1">Lien invalide</Typography>
  <Typography variant="body2">Le lien que vous avez utilisé est invalide, veuillez réessayer.</Typography>
</Alert>

export const unknownError = <Alert variant="filled" severity="error">
  <Typography variant="body2">Une erreur est survenue, veuillez réessayer.</Typography>
</Alert>

export const expiredCodeError = <Alert variant="filled" severity="error">
  <Typography variant="body2">Le code a expiré ou est invalide, veuillez réessayer.</Typography>
</Alert>

export const codeSent = <Alert variant="filled" severity="success">
  <Typography variant="body2">Le code a été envoyé.</Typography>
</Alert>