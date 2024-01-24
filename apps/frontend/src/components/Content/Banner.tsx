import Link from "next/link"
import Button from "../Button"
import Image from "next/image"
import { IoIosArrowRoundForward } from "react-icons/io";


type BannerProps = {
  surTitle: string
  title: string
  description: string | JSX.Element
  links?: Array<{
    title: string
    description: string | JSX.Element
    href: string
  }>
  cta: {
    label: string
    href: string
  }
}

export default function Banner(props: BannerProps) {
  return <div className="bg-indigo-600 flex max-w-[1440px] relative mt-8 flex-col-reverse md:flex-row">

    <Image
      src={"/assets/svg/banner-shape.svg"}
      alt="Forme arrondie de la bannière"
      className="absolute !h-[170px] !bottom-[calc(100%-1px)] !top-[unset] -z-10 object-contain object-bottom"
      fill
    />

    <div className="md:w-1/2">
      <Image
        className="next-image-reset md:h-[687px] h-[343px] sm:h-[auto] 2xl:object-bottom object-contain"
        alt="Illustration de la bannière d'information"
        src={"/assets/svg/signin.svg"}
        height={687}
        width={720}
      />
    </div>
    <div className="md:w-1/2 mt-8 md:mt-0 2xl:px-20 px-8 flex flex-col justify-center">
      <h3 className="mb-2 text-indigo-400 uppercase font-medium">{props.surTitle}</h3>
      <h2 className="mb-2 text-white">{props.title}</h2>
      <p className="text-white">{props.description}</p>
      {props.links && <ul className="mt-4 flex flex-col gap-4">
        {props.links.map((link, index) => <li key={index}>
          <Link href={link.href} className="flex gap-2">
            <IoIosArrowRoundForward className="mt-[2px] text-white min-w-[20px] h-[20px] w-[20px]" />
            <div>
              <h4 className="font-semibold text-white text-base">{link.title}</h4>
              <p className="text-white">{link.description}</p>
            </div>
          </Link>
        </li>)}
      </ul>}
      <Link href={props.cta.href} className="mt-8 flex justify-center md:justify-start">
        <Button variant="filled" color="secondary">
          {props.cta.label}
        </Button>
      </Link>
    </div>
  </div>

}