import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

type LogoProps = {
  variant?: 'light' | 'dark'
  className?: string
}

export default function Logo(props: LogoProps) {
  return <Link href="/">
    <Image
      fill
      priority
      alt={"Logo de la plateforme"}
      className={twMerge("next-image-reset max-w-[98px] sm:!w-auto sm:!h-auto sm:max-w-[unset]", props.className)}
      src={props.variant === 'light'
        ? "/assets/svg/logo-light.svg"
        : "/assets/svg/logo.svg"
      }
    />
  </Link>
}