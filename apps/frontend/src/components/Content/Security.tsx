import Image from "next/image";
import PageItem from "../Layout/PageItem";

type SecurityProps = {
  title: string
  description: string | JSX.Element
}

export default function Security(props: SecurityProps) {

  return <PageItem autoSpacing className="flex justify-center">
    <div className="rounded-2xl max-w-[1080px] flex-col-reverse items-center md:flex-row bg-indigo-700 flex md:gap-9">
      <Image
        src="/assets/svg/security.svg"
        alt="Illustration pour le contenu en rapport avec la sécurité"
        width={210}
        height={178}
      />
      <div className="py-8 px-6">
        <h3 className="text-xl text-white">{props.title}</h3>
        <p className="text-white">{props.description}</p>
      </div>
    </div>
  </PageItem>

}