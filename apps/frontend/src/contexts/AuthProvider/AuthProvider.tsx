'use client';

import { type Authentificator, CookieAdapter } from "@cipher-health/sdk";
import { AuthentificatorProvider } from "@cipher-health/sdk/react";
import { useRef } from "react";
import { userAtom, authStore, isConnectedAtom } from "./authStore";
import { useMount } from "@cipher-health/utils/react";
import { Provider } from "jotai";

type AuthProviderProps = {
  children: React.ReactNode
}


export default function AuthProvider(props: AuthProviderProps) {

  const authentificatorRef = useRef<Authentificator>(null)

  useMount(() => {
    const authentificator = authentificatorRef.current
    if (authentificator === null) return

    authentificator.isConnected().then(async (isConnected) => {
      if (!isConnected) {
        authStore.set(isConnectedAtom, false)
        return
      }
      const user = await authentificator.me().catch(() => null)
      authStore.set(userAtom, user)
      authStore.set(isConnectedAtom, !!user)
    })
  })

  return <AuthentificatorProvider
    baseUrl={process.env.NEXT_PUBLIC_API_HOST}
    adapter={new CookieAdapter()}
    ref={authentificatorRef}
  >
    <Provider store={authStore}>
      {props.children}
    </Provider>
  </AuthentificatorProvider>
}