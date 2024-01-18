import { useAuthentificator } from "@cipher-health/sdk/react";
import { useCallback } from "react";



export default function useCreateProfile() {

  const authentificator = useAuthentificator()

  const createProfile = useCallback(async (payload: Record<string, any>) => {

    const [res, error] = await authentificator.createProfile(payload)

    if (error instanceof Error) {
      throw error
    }

    return [res, error] as const

  }, [])

  return createProfile
}