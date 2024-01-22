import Button from "../Button";
import { LuUser } from "react-icons/lu";
import Logo from "../Logo";
import Image from "next/image";
import PageItem from "./PageItem";


export default function Header() {

  return <PageItem as="header" className="w-full flex justify-between items-center py-3 mb-8">
    <Logo />
    <Image
      fill
      alt="Svg de la bannière"
      className="!w-[340px] !h-[343px] absolute top-0 left-0 -z-10 select-none pointer-events-none"
      src="/assets/svg/circle.svg"
    />
    <nav>
      <ul className="flex gap-6 items-center">
        <li className="hidden md:block">
          <Button
            variant="plain"
            className="no-underline font-roboto"
          >
            Vous êtes un praticien
          </Button>
        </li>
        <li>
          <Button
            startContent={<LuUser />}
          >
            Se connecter
          </Button>
        </li>
      </ul>
    </nav>
  </PageItem>
}