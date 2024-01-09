

type InformationCardProps = {
  children: React.ReactNode
  startContent?: React.ReactNode
}

export default function InformationCard(props: InformationCardProps) {
  return <div className="bg-indigo-300 rounded-lg flex px-2 py-3 items-center justify-center gap-2">
    {props.startContent}
    {props.children}
  </div>
}