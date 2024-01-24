import Link from "next/link";
import PageItem from "../Layout/PageItem"
import { SlArrowRight } from "react-icons/sl";
import { cloneElement } from "react";
import HeaderCard, { HeaderCardProps } from "../Card/HeaderCard";


type ServicesProps = HeaderCardProps & {
  services: Array<{
    title: string
    description: string | JSX.Element
    icon: JSX.Element
    href?: string
  }>
}

function ServiceItem({ service }: { service: ServicesProps["services"][number] }) {

  const containerClassNames = "flex flex-col sm:flex-row gap-4 sm:gap-6 items-center"

  const content = <>
    <div className="bg-indigo-300 rounded-lg w-[44px] h-[44px] sm:min-w-[56px] sm:w-[56px] sm:h-[56px] flex items-center justify-center">
      {cloneElement(service.icon, { className: "max-w-[24px] max-h-[24px] sm:max-w-[32px] sm:max-h-[32px]" })}
    </div>
    <div>
      <h5 className="text-md text-center sm:text-left text-indigo-500 mb-2 gap-2 items-center sm:flex">
        {service.title}
        <SlArrowRight className="h-[16px] hidden sm:block" />
      </h5>
      <p className="text-gray-600 text-center sm:text-left">{service.description}</p>
    </div>
  </>

  if (service.href) return <li>
    <Link href={service.href} className={containerClassNames}>
      {content}
    </Link>
  </li>

  return <li className={containerClassNames}>
    {content}
  </li>
}

export default function Services(props: ServicesProps) {
  return <PageItem className="flex flex-col items-center">
    <HeaderCard
      title={props.title}
      surTitle={props.surTitle}
      description={props.description}
    />
    <ul className="flex flex-col max-w-[1040px] rounded-2xl w-full md:grid md:grid-cols-2 gap-10 bg-white shadow-[0px_0px_10px_0px_rgba(115,73,214,0.20)] px-12 py-9">
      {props.services.map((service, index) => <ServiceItem
        key={index}
        service={service}
      />)}
    </ul>
  </PageItem>
}