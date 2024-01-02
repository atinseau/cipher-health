// app/providers.tsx
'use client'

import { NextUIProvider as NextUIProviderInternal } from '@nextui-org/react'

export function NextUIProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProviderInternal>
      {children}
    </NextUIProviderInternal>
  )
}