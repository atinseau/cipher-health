import { twMerge } from 'tailwind-merge'

type AuthContainerProps = {
  title: string
  subTitle: string
  className?: string
  subTitleClassName?: string
  children?: React.ReactNode
  footer?: React.ReactNode
}

export default function AuthContainer(props: AuthContainerProps) {

  return <div className={twMerge("flex flex-col gap-8 items-center max-w-[608px] w-full", props.className)}>
    <div className="flex flex-col gap-2 text-center">
      <h1 className="text-xl text-indigo-500">{props.title}</h1>
      <p className={twMerge("text-sm text-gray-600", props.subTitleClassName)}>{props.subTitle}</p>
    </div>
    <div className="flex flex-col gap-8 justify-center items-center max-w-[480px] w-full">
      {props.children}
      {props.footer}
    </div>
  </div>
}