import Image from "next/image";


export default function Logo() {
  return <Image
    fill
    priority
    alt="Logo de la plateforme"
    className="next-image-reset max-w-[98px] sm:!w-auto sm:!h-auto sm:max-w-[unset]"
    src="/assets/svg/logo.svg"
  />
}