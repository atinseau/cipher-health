import Link from "next/link"
import Button from "../Button"
import ActualityCard, { ActualityCardProps } from "../Card/ActualityCard"
import PageItem from "../Layout/PageItem"

type ActualitiesProps = {
  title: string
  actualities: ActualityCardProps[]
  cta?: {
    label: string
    href: string
  }
}

export default function Actualities(props: ActualitiesProps) {
  return <PageItem autoSpacing>
    <h2 className="mb-8">{props.title}</h2>
    <ul className="flex flex-col md:flex-row gap-12">
      {props.actualities.slice(0, 3).map((actuality, index) => <li key={index}>
        <ActualityCard {...actuality} />
      </li>)}
    </ul>
    {props.cta && <Link href={props.cta.href} className="mt-8 flex justify-center">
      <Button>
        {props.cta.label}
      </Button>
    </Link>}
  </PageItem>
}