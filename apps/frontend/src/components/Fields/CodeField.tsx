import CodeInput from "@/components/Inputs/CodeInput";
import { useActiveForm } from "@cipher-health/form";
import { Controller } from "react-hook-form";

type CodeFieldProps = {
  codePropertyName?: string
  onCompleted?: () => void
}

export default function CodeField(props: CodeFieldProps) {

  const { codePropertyName = "code" } = props
  const { form } = useActiveForm()

  return <Controller
    name={codePropertyName}
    control={form.control}
    render={({ field }) => <CodeInput
      onCompleted={props.onCompleted}
      onChange={field.onChange}
    />}
  />
}