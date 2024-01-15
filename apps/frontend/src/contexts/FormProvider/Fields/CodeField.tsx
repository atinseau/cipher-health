import CodeInput from "@/components/Inputs/CodeInput";
import useActiveForm from "../hooks/useActiveForm";
import { Controller } from "react-hook-form";

type CodeFieldProps = {
  codePropertyName?: string
}

export default function CodeField(props: CodeFieldProps) {

  const { codePropertyName = "code" } = props
  const { form } = useActiveForm()

  return <Controller
    name={codePropertyName}
    control={form.control}
    render={({ field }) => <CodeInput
      onChange={field.onChange}
    />}
  />
}