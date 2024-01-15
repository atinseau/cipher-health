import useNotify from "@/contexts/NotificationProvider/hooks/useNotify";
import { useAuthentificator } from "@cipher-health/sdk/react";
import { useCallback } from "react";



export default function useVerify() {

  const authentificator = useAuthentificator()
  const notify = useNotify()

  const verify = useCallback(async (code: string) => {
    const [result, error] = await authentificator.verify(code)

    if (error && error?.status !== 400) {
      throw error
    }

    if (error) {
      notify({
        type: 'error',
        title: 'Attention !',
        message: 'Le code de vérification est invalide'
      })
      return false
    }

    notify({
      type: 'success',
      title: 'Félicitations !',
      message: 'Votre compte a été vérifié avec succès'
    })
    return true
  }, [])

  const send = useCallback(async () => {
    if (!await authentificator.sendVerificationCode()) {
      notify({
        type: 'error',
        title: 'Une erreur est survenue',
        message: 'Impossible d\'envoyer le code de vérification, veuillez réessayer plus tard'
      })
    }
  }, [])

  return {
    verify,
    send
  }

}