import { useAuthentificator } from "@cipher-health/sdk/react";
import { useCallback } from "react";
import { authStore, isConnectedAtom, userAtom } from "../authStore";
import useNotify from "@/contexts/NotificationProvider/hooks/useNotify";


export default function useSignin() {

  const authentificator = useAuthentificator()
  const notify = useNotify()

  const signin = useCallback(async (email: string, password: string, twoFactorNotify?: boolean) => {
    await authentificator.login({
      email,
      password
    })

    if (typeof twoFactorNotify === "undefined" || twoFactorNotify) {
      notify({
        type: 'info',
        title: 'Code de vérification',
        message: 'Un code de vérification vous a été envoyé par SMS.'
      })
    }
  }, [])

  const verify = useCallback(async (code: string) => {
    await authentificator.loginCallback(code)
    const user = await authentificator.me().catch(() => null)

    if (user) {
      authStore.set(userAtom, user)
      authStore.set(isConnectedAtom, true)
      notify({
        type: 'success',
        title: 'Connexion réussie',
        message: 'Vous êtes maintenant connecté.'
      })
    }
  }, [])

  return {
    signin,
    verify
  }
}