import useNotify from "@/contexts/NotificationProvider/hooks/useNotify";
import { ClientError } from "@cipher-health/sdk";
import { useAuthentificator } from "@cipher-health/sdk/react";
import { useCallback } from "react";



export default function useSignin() {

  const authentificator = useAuthentificator()

  const signin = useCallback(async (email: string, password: string) => {

    try {
      await authentificator.login({
        email,
        password
      })
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