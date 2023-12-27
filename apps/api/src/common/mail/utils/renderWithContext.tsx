import EmailProvider, { IEmailContext } from "../contexts/EmailProvider"


export default function renderWithContext<T extends ((...args: any[]) => JSX.Element) | React.FC>(options: {
  component: T,
  componentProps: React.ComponentProps<T>,
  ctx: IEmailContext
}) {

  const {
    component: Component,
    componentProps,
    ctx
  } = options

  return <EmailProvider {...ctx}>
    <Component {...componentProps}/>
  </EmailProvider>
}