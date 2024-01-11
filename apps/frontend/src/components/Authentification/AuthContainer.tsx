import type { StaticImport } from "next/dist/shared/lib/get-img-props"
import Image from "next/image"

type AuthContainerProps = {
  children: React.ReactNode
  src: string | StaticImport
}

export default function AuthContainer(props: AuthContainerProps) {

  return <div className="flex h-screen w-screen">
    <div className="w-1/2 flex justify-center px-6 pt-8 mb-8 overflow-y-scroll">
      <div className="flex flex-col w-full max-w-[608px]">
        <div className="w-full mb-8">
          <Image
            fill
            priority
            alt="Logo de la plateforme"
            className="next-image-reset !w-auto !h-auto"
            src="/assets/svg/logo.svg"
          />
        </div>
        {props.children}
      </div>
    </div>
    <div className="w-1/2 bg-indigo-400">
      <Image
        className="w-fit h-fit next-image-reset object-bottom"
        alt="Illustration du formulaire d'authentification"
        src={props.src}
        fill
      />
    </div>
  </div>

}