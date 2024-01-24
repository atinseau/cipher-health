import { twMerge } from "tailwind-merge"


export type HeaderCardProps = {
  title: string
  surTitle: string
  description: string | JSX.Element
  className?: string
}

export default function HeaderCard(props: HeaderCardProps) {
  return <div className={twMerge("flex text-center items-center justify-center flex-col gap-2 mb-12", props.className)}>
    <h3 className="uppercase text-pink-500 font-medium">{props.surTitle}</h3>
    <h2>{props.title}</h2>
    <p className="max-w-[762px] w-full">{props.description}</p>
  </div>
}