import { ClientError } from "@cipher-health/sdk";
import { useAuthentificator } from "@cipher-health/sdk/react";
import { useCallback } from "react";
import { authStore, isConnectedAtom, userAtom } from "../authStore";


export default function useSignin() {

  const authentificator = useAuthentificator()

  const signin = useCallback(async (email: string, password: string) => {

    try {
      await authentificator.login({
        email,
        password
      })

      const user = await authentificator.me().catch(() => null)
      authStore.set(userAtom, user)
      authStore.set(isConnectedAtom, !!user)

    } catch (e) {
      // Very fatal error (should not happen)
      if (e instanceof ClientError) {
        e.message = "Connexion automatique impossible, les identifiants ne devrait pas être erronés. Veuillez réessayer."
      }
      throw e
    }

  }, [])

  return signin
}