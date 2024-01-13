import { useAuthentificator } from "@cipher-health/sdk/react";
import { ClientError } from "@cipher-health/sdk";
import { useCallback } from "react";
import useNotify from "@/contexts/NotificationProvider/hooks/useNotify";



export default function useSignup() {

  const authentificator = useAuthentificator()
  const notify = useNotify()

  const signup = useCallback(async (data: Parameters<typeof authentificator.signup>[0]) => {
    const [res, error] = await authentificator.signup(data)

    // Non parseable error
    // instead of other error ({ key, message })
    if (error instanceof ClientError) {
      notify({
        type: 'error',
        title: 'Une erreur est survenue',
        message: error.message,
      })
      throw error
    }

    return [res, error] as const
  }, [])

  return signup
}