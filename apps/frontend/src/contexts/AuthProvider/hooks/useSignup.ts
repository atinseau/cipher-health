import { useAuthentificator } from "@cipher-health/sdk/react";
import { ClientError } from "@cipher-health/sdk";
import { useCallback } from "react";
import useSignin from "./useSignin";


export default function useSignup() {

  const authentificator = useAuthentificator()
  const { signin } = useSignin()

  const signup = useCallback(async (data: Parameters<typeof authentificator.signup>[0]) => {
    const [res, error] = await authentificator.signup(data)

    // Non parseable error
    // instead of other error ({ key, message })
    if (error instanceof ClientError) {
      throw error
    }

    // Auto signin on signup to continue the flow without asking the user to signin
    if (!error) {
      await signin(data.email, data.password, false)
    }

    return [res, error] as const
  }, [])

  return signup
}