'use client';

import React, { createContext, forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { Authentificator } from "../../classes/Authentificator";
import { AuthentificatorAdapter } from "../../classes/adapters/AuthentificatorAdapter";
import { LocalStorageAdapter } from "../../classes/adapters/LocalStorageAdapter";

type IAuthentificatorContext = {
  authentificator: Authentificator
}

type AuthentificatorProviderProps = {
  children: React.ReactNode
  baseUrl: string
  adapter?: AuthentificatorAdapter
  debug?: boolean
}

export const AuthentificatorContext = createContext({} as IAuthentificatorContext)

const AuthentificatorProvider = forwardRef<Authentificator, AuthentificatorProviderProps>((props, ref) => {

  const authentificatorRef = useRef<Authentificator>()

  if (authentificatorRef.current === undefined) {
    if (props.adapter === undefined || (props.adapter instanceof LocalStorageAdapter && typeof window === 'undefined')) {
      throw new Error('LocalStorageAdapter cannot be used on server side')
    }

    authentificatorRef.current = new Authentificator({
      adapter: props.adapter,
      debug: props.debug || false,
      clientOptions: {
        baseUrl: props.baseUrl,
      }
    })
  }

  const value = useMemo<IAuthentificatorContext>(() => ({
    authentificator: authentificatorRef.current!
  }), [])

  useImperativeHandle(ref, () => authentificatorRef.current!)

  return <AuthentificatorContext.Provider value={value}>
    {props.children}
  </AuthentificatorContext.Provider>
})

export default AuthentificatorProvider