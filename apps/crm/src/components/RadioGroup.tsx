import FormControl, { type FormControlProps } from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import {
  default as RadioGroupMui,
  RadioGroupProps as RadioGroupPropsMui
} from "@mui/material/RadioGroup";

interface RadioGroupProps extends FormControlProps {
  label: string
  id: string
  name?: string
  defaultValue: string
  options: {
    value: string
    label: string
  }[]
  radioGroupProps?: RadioGroupPropsMui
  error?: boolean
  helperText?: string
}

export default function RadioGroup({ label, error, helperText, radioGroupProps, id, name, defaultValue, options, ...rest }: RadioGroupProps) {
  return <FormControl {...rest}>
    <FormLabel error={error} id={id}>{label + (helperText ? " " + helperText: "")}</FormLabel>
    <RadioGroupMui
      {...radioGroupProps}
      name={name}
      defaultValue={defaultValue}
    >
      {options.map((option) => (<FormControlLabel
        key={option.value}
        value={option.value}
        control={<Radio />}
        label={option.label}
      />))}
    </RadioGroupMui>
  </FormControl>
}