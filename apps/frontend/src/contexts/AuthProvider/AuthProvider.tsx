'use client';

import { CookieAdapter } from "@cipher-health/sdk";
import { AuthentificatorProvider } from "@cipher-health/sdk/react";

type AuthProviderProps = {
  children: React.ReactNode
}

export default function AuthProvider(props: AuthProviderProps) {

  return <AuthentificatorProvider
    baseUrl={process.env.NEXT_PUBLIC_API_HOST}
    adapter={new CookieAdapter()}
  >
    {props.children}
  </AuthentificatorProvider>

}