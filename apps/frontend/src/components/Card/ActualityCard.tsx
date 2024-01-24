import clsx from "clsx"
import Image from "next/image"
import Link from "next/link"
import Button from "../Button"
import { IoIosArrowRoundForward } from "react-icons/io";


export type ActualityCardProps = {
  title: string
  description: string
  categories: Array<{
    label: string
    color?: 'purple' | 'indigo' | 'pink'
  }>
  image: string
  href: string
}

export default function ActualityCard(props: ActualityCardProps) {

  return <div className="flex flex-col">
    <Image
      src={props.image}
      alt={props.title}
      width={394}
      height={230}
      className="rounded-2xl mb-4 w-full max-w-[394px] self-center"
    />
    <ul className="mb-2">
      {props.categories.map((category, index) => {

        const color = category.color || 'indigo'

        return <li
          className={clsx("text-[14px] px-2 py-1 rounded-md w-fit", {
            "bg-indigo-300 text-indigo-500": color === 'indigo',
            "bg-purple-400 text-purple-500": color === 'purple',
            "bg-pink-400 text-pink-500": color === 'pink',
          })}
          key={index}
        >
          {category.label}
        </li>
      })}
    </ul>
    <h3 className="mb-2">{props.title}</h3>
    <p className="mb-2">{props.description}</p>
    <Link href={props.href} className="self-end">
      <Button
        variant="plain"
        endContent={<IoIosArrowRoundForward className="h-[20px] w-[20px]" />}
      >
        Lire l'article
      </Button>
    </Link>
  </div>

}