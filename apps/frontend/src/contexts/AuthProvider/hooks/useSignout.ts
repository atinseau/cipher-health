import useNotify from "@/contexts/NotificationProvider/hooks/useNotify";
import { useAuthentificator } from "@cipher-health/sdk/react";
import { authStore, isConnectedAtom, userAtom } from "../authStore";
import { useRouter } from "next/navigation";
import { SIGNIN_URL } from "@/utils/constants";



export default function useSignout() {

  const authentificator = useAuthentificator()
  const notify = useNotify()
  const router = useRouter()

  const signout = async () => {
    try {
      await authentificator.logout()
      authStore.set(userAtom, null)
      authStore.set(isConnectedAtom, false)
      router.push(SIGNIN_URL)
      notify({
        type: 'success',
        title: 'Déconnexion réussie',
        message: 'Vous êtes maintenant déconnecté.'
      })
    } catch (e) {
      notify({
        type: 'error',
        title: 'Erreur',
        message: 'Une erreur est survenue lors de la déconnexion.'
      })
    }
  }

  return signout
}