import clsx from "clsx";
import { twMerge } from "tailwind-merge";

type LinkItemProps = {
  isActive?: boolean
  isCompleted?: boolean
}

type StepItemProps = {
  title: string
  isActive?: boolean
  isCompleted?: boolean
  rightLink?: LinkItemProps
  leftLink?: LinkItemProps
}

const LinkItem = ({ isActive, isCompleted, className }: LinkItemProps & { className?: string }) => {
  return <span className={clsx(className, "z-0 absolute w-1/2 flex content-[''] h-[2px] bottom-[7px]", {
    "bg-gray-500": isActive,
    "bg-indigo-500": isCompleted,
  })} />
}

const StepItem = ({ title, isActive, isCompleted, rightLink, leftLink }: StepItemProps) => {

  return <div className="flex flex-col items-center gap-2 relative w-full">
    <p className={clsx({
      "text-indigo-500": isActive,
      "text-gray-500": !isActive,
    })}>{title}</p>
    <span className={twMerge(clsx("bg-white z-10 flex content-[''] w-[16px] h-[16px] border-[2px] rounded-full", {
      "border-indigo-500": isActive,
      "border-gray-500": !isActive,
      "bg-indigo-500 !border-indigo-500": isCompleted,
    }))} />

    {leftLink && <LinkItem className="right-1/2" {...leftLink} />}
    {rightLink && <LinkItem className="left-1/2" {...rightLink} />}
  </div>

}

type StepBarProps = {
  currentStep?: number
  steps: Array<{
    title: string
    // isActive?: boolean
    // isCompleted?: boolean
  }>
}

export default function StepBar({ steps, currentStep = 0 }: StepBarProps) {
  return <div className="flex items-center w-full justify-center">
    {steps.map((step, index) => <StepItem
      key={index}
      title={step.title}
      isActive={index === currentStep}
      isCompleted={index < currentStep}
      rightLink={{
        isActive: index >= currentStep && index < steps.length - 1,
        isCompleted: index < currentStep && index < steps.length - 1,
      }}
      leftLink={{
        isActive: index > 0 && index > currentStep,
        isCompleted: index > 0 && index <= currentStep,
      }}
    />)}
  </div>
}