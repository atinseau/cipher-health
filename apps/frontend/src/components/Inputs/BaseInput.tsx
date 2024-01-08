import classNames from "classnames";

export type BaseInputProps = {
  helperText?: string;
  label?: string
  subLabel?: string | { value: string, action: () => void };
  required?: boolean
}

export default function BaseInput(props: BaseInputProps & { children: React.ReactNode }) {

  const {
    helperText,
    label,
    subLabel,
    required,
    children
  } = props

  const subLabelAction = typeof subLabel === "object" ? subLabel.action : undefined
  const subLabelValue = typeof subLabel === "object" ? subLabel.value : subLabel

  return <div className="w-full">
    {label && <h6 className="text-indigo-600 mb-2">{label}<span className="text-danger">{required && " *"}</span></h6>}
    {helperText && <p className="text-xs mb-2 text-gray-600">{helperText}</p>}
    {children}
    {subLabel && <p
      className={classNames("text-gray-600 mt-2", {
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