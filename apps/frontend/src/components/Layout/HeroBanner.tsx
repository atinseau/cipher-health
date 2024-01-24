import Image from "next/image"
import Button from "../Button"
import clsx from "clsx"


type HeroBannerProps = {
  title: string | React.ReactNode
  description: string
  ctas: Array<{
    label: string
    className?: string
    href?: string
  }>
}

export default function HeroBanner(props: HeroBannerProps) {
  return <div className="flex flex-col md:flex-row gap-8 w-full md:h-[609px] items-center max-w-[1440px]">
    <div className="w-full max-w-[604px] px-6 md:px-0 md:ml-20 flex flex-col items-center md:items-start">
      <h1 className="mb-4 text-center md:text-left">{props.title}</h1>
      <p className="mb-8 text-[18px] text-center md:text-left">{props.description}</p>
      <div className="flex flex-col gap-8">
        {props.ctas.map((cta, index) => <Button
          key={index}
          variant={index === 0 ? "filled" : "outlined"}
          className={clsx("w-fit", cta.className)}
        >
          {cta.label}
        </Button>)}
      </div>
    </div>
    <div className="w-full h-full relative overflow-hidden">
      <span className="absolute bg-indigo-500 w-[50px] h-[50px] md:w-[99px] md:h-[99px] rounded-full left-[10%] bottom-[15px] md:left-[54px] md:bottom-10" />
      <Image
        width={385}
        height={429}
        src="/assets/svg/shape-home-1.svg"
        alt="Svg de la bannière"
        className="absolute w-[39%] md:w-auto left-[2%] top-0 md:left-[14px] md:top-[18px]"
      />
      <Image
        priority
        width={684}
        height={613}
        className="pl-10 rounded-l-[46%] md:rounded-l-full w-full h-full object-cover max-w-full"
        alt="Illustration de la page d'accueil"
        src="/assets/images/home.jpeg"
      />
    </div>
  </div>
}