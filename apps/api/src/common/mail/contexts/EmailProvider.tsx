import { createContext, useContext } from "react";

export interface IEmailContext {
  sender?: string
  receiver?: string
}

const EmailContext = createContext({} as IEmailContext)

interface IEmailProviderProps extends IEmailContext {
  children: React.ReactNode
}

export const useEmailContext = () => {
  return useContext(EmailContext)
}

export default function EmailProvider({ children, ...ctx }: IEmailProviderProps) {
  return <EmailContext.Provider value={ctx}>
    {children}
  </EmailContext.Provider>
}