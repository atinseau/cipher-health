import { useAuthentificator } from "@cipher-health/sdk/react";
import { useCallback } from "react";



export default function useCreateProfile() {

  const authentificator = useAuthentificator()

  const createProfile = useCallback(async (payload: Record<string, any>) => {

    authentificator.createProfile(payload)

  }, [])

  return createProfile
}