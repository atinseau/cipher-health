import { IoInformationCircleOutline } from "react-icons/io5";


type InformationCardProps = {
  children: React.ReactNode
}

export default function InformationCard(props: InformationCardProps) {
  return <div className="bg-indigo-300 rounded-lg flex px-2 py-3 items-center justify-center gap-2">
    <IoInformationCircleOutline size={20} className="text-indigo-500" />
    {props.children}
  </div>
}