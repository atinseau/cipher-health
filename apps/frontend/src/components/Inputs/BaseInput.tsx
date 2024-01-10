import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export type BaseInputProps = {
  helperText?: string;
  label?: string
  subLabel?: string | { value: string, action: () => void };
  isRequired?: boolean
  withContainer?: boolean
  containerRef?: React.Ref<HTMLDivElement>
  classNames?: {
    subLabel?: string,
    base?: string
  }
}

export default function BaseInput(props: BaseInputProps & { children: React.ReactNode }) {

  const {
    helperText,
    label,
    subLabel,
    isRequired,
    children
  } = props

  if (props?.withContainer === false) return children

  const subLabelAction = typeof subLabel === "object" ? subLabel.action : undefined
  const subLabelValue = typeof subLabel === "object" ? subLabel.value : subLabel

  return <div
    className={clsx("w-full", props?.classNames?.base)}
    ref={props?.containerRef}
  >
    {label && <h6 className="text-indigo-600 mb-2">{label}<span className="text-danger">{isRequired && " *"}</span></h6>}
    {helperText && <p className={"text-xs mb-2 text-gray-600"}>{helperText}</p>}
    {children}
    {subLabel && <p
      className={clsx(twMerge("text-gray-600 mt-2", props.classNames?.subLabel), {
        "cursor-pointer": subLabelAction,
        "hoverunderline": subLabelAction
      })}
      onClick={subLabelAction}
    >
      {subLabelValue}
    </p>
    }
  </div>
}