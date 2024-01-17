import { useActiveForm } from "@cipher-health/form";
import { Controller } from "react-hook-form";
import Code from "../TwoFaCode";

type CodeFieldProps = {
  codePropertyName?: string
}

export default function CodeField(props: CodeFieldProps) {

  const { codePropertyName = "code" } = props
  const { form } = useActiveForm()

  return <Controller
    name={codePropertyName}
    control={form.control}
    render={({ field }) => <Code
      onChange={field.onChange}
    />}
  />
}