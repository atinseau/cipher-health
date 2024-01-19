import Button from "@/components/Button"
import { useValidForm } from "@cipher-health/form"

export default function SigninCredentialFooter() {

  const isValid = useValidForm()

  return <div className="flex flex-col">
    <Button
      type="submit"
      className="mb-8"
      isDisabled={!isValid}
    >
      Se connecter
    </Button>
    <a className="mb-4">Pas encore de compte ?</a>
    <Button variant="outlined">Créer mon compte</Button>
  </div>
}