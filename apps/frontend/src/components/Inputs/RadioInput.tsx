import { RadioGroup, RadioGroupProps, Radio } from '@nextui-org/radio'
import BaseInput, { BaseInputProps } from './BaseInput'
import { ChangeEvent } from 'react'

export type RadioItem = {
  label: string,
  value: string
}

export type RadioInputProps = Omit<RadioGroupProps & BaseInputProps, 'onChange'> & {
  label?: string,
  items: Array<RadioItem>
  onChange?: (item: RadioItem) => void
}

export default function RadioInput(props: RadioInputProps) {

  const {
    label,
    items,
    subLabel,
    onChange,
    ...radioGroupProps
  } = props

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      const item = items.find(item => item.value === e.target.value)
      if (item) onChange(item)
    }
  }

  return <BaseInput
    {...radioGroupProps}
    subLabel={subLabel}
    label={label}
    isRequired={radioGroupProps.isRequired}
    classNames={{
      subLabel: "text-sm"
    }}
  >
    <RadioGroup
      {...radioGroupProps}
      onChange={handleChange}
      classNames={{
        wrapper: "gap-6"
      }}
    >
      {items.map((item, index) => <Radio
        key={index}
        value={item.value}
        classNames={{
          base: 'max-w-[none] data-[invalid=true]:border-danger flex-1 whitespace-nowrap rounded-sm p-2.5 m-0 border border-indigo-500 data-[selected=true]:bg-indigo-300',
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