import type { StaticImport } from "next/dist/shared/lib/get-img-props"
import Image from "next/image"
import Logo from "../Logo"

type AuthContainerProps = {
  children: React.ReactNode
  src: string | StaticImport
}

export default function AuthContainer(props: AuthContainerProps) {

  return <div className="flex h-screen w-screen">
    <div className="overflow-y-scroll w-full md:w-1/2 flex justify-center px-6 pt-6 mb-6 md:pt-8 md:mb-8">
      <div className="flex flex-col w-full max-w-[608px]">
        <div className="w-full mb-6 sm:mb-8 flex justify-center sm:justify-start">
          <Logo />
        </div>
        {props.children}
      </div>
    </div>
    <div className="hidden md:block md:w-1/2 bg-indigo-400 select-none">
      <Image
        className="w-fit h-fit next-image-reset object-bottom"
        alt="Illustration du formulaire d'authentification"
        src={props.src}
        fill
      />
    </div>
  </div>

}