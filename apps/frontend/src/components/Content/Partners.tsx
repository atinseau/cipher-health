import Image from "next/image";
import PageItem from "../Layout/PageItem";

type PartnersProps = {
  title: string
  partners: Array<{
    image: string
    alt: string
  }>
}

export default function Partners(props: PartnersProps) {

  return <PageItem autoSpacing>
    <h2 className="mb-8 text-center">{props.title}</h2>
    <ul className="gap-8 lg:gap-[88px] lg:flex lg:justify-center grid sm:grid-cols-2 grid-cols-1">
      {props.partners.map((partner, index) => <li key={index} className="w-fit lg:w-auto mx-auto lg:mx-[unset]">
        <Image
          src={partner.image}
          alt={partner.alt}
          fill
          className="next-image-reset max-h-[60px] min-h-[60px] !w-auto"
        />
      </li>)}
    </ul>
  </PageItem>
}