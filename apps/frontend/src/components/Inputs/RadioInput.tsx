import { RadioGroup, RadioGroupProps, Radio } from '@nextui-org/radio'
import BaseInput, { BaseInputProps } from './BaseInput'

type RadioInputProps = RadioGroupProps & BaseInputProps & {
  label?: string,
  items: Array<{ label: string, value: string }>
}

export default function RadioInput(props: RadioInputProps) {

  const {
    label,
    items,
    subLabel,
    ...radioGroupProps
  } = props

  return <BaseInput
    {...radioGroupProps}
    subLabel={subLabel}
    label={label}
    required={radioGroupProps.isRequired}
    classNames={{
      subLabel: "text-sm"
    }}
  >
    <RadioGroup
      {...radioGroupProps}
      classNames={{
        wrapper: "gap-6"
      }}
    >
      {items.map((item, index) => <Radio
        key={index}
        value={item.value}
        classNames={{
          base: 'max-w-[none] flex-1 whitespace-nowrap rounded-sm p-2.5 m-0 border border-indigo-500 data-[selected=true]:bg-indigo-300',
          label: "text-base",
          control: "bg-indigo-500",
          wrapper: "group-data-[selected=true]:border-indigo-500"
        }}
      >
        {item.label}
      </Radio>)}
    </RadioGroup>
  </BaseInput>
}