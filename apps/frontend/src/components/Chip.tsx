import { createVariants, pickVariant } from "@/utils/variants"
import clsx from "clsx"

import { RxCross1 } from "react-icons/rx";


type ChipProps = {
  label: string
  onDelete?: () => void
  variant?: string
  color?: string
}

const chipVariants = createVariants({
  "filled": {
    "className": "",
    colors: {
      primary: "",
      danger: {
        container: "bg-pink-400 p-1 gap-1 rounded-md flex justify-between items-center",
        label: "text-pink-500",
        deleteIcon: "text-pink-500 cursor-pointer",
      },
    }
  }
})

export default function Chip(props: ChipProps) {

  const {
    label,
    onDelete
  } = props

  const { classNames } = pickVariant(
    chipVariants,
    props?.variant || "filled" as any,
    props?.color || "danger" as any
  )

  return <div className={clsx(classNames?.container)}>
    <p className={clsx(classNames?.label)}>{label}</p>
    {onDelete && <RxCross1 className={clsx(classNames?.deleteIcon)} onClick={onDelete} />}
  </div>

}