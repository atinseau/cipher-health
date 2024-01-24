import Link from "next/link";
import Logo from "../Logo";
import PageItem from "./PageItem";


export default function Footer() {
  return <PageItem
    as="footer"
    autoSpacing
    limitless
    className="bg-indigo-600 py-12"
  >
    <div className="grid lg:grid-cols-4 gap-y-8 items-center">
      <Logo variant="light" className="mx-auto col-span-2 sm:mx-[unset] lg:col-auto" />
      <ul className="gap-x-2 col-span-2 justify-center text-center sm:justify-start sm:text-left grid sm:grid-cols-2 text-white">
        <li>Blog</li>
        <li>Protection des données</li>
        <li>Honoraires et remboursement</li>
        <li>Mentions légales</li>
        <li>Conditions générales d’utilisation</li>
      </ul>
      <Link className="bg-white col-span-2 text-center lg:col-auto rounded-lg text-pink-500 p-4 h-fit w-fit mx-auto sm:mx-[unset]" href={"tel:15"}>
        En cas d’urgence absolue, appelez le SAMU (15)
      </Link>
    </div>
    <p className="text-white mt-12 text-center sm:text-left">Copyright {new Date().getFullYear()} © Hygiie</p>
  </PageItem>
}