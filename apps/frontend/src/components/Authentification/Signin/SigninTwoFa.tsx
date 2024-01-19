import AuthFormContainer from "../AuthFormContainer";
import Button from "@/components/Button";
import { FormStepSubmitHandler, useFormContext, useFormStep } from "@cipher-health/form";
import { useCallback } from "react";
import CodeField from "@/components/Fields/CodeField";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useSignin from "@/contexts/AuthProvider/hooks/useSignin";

const twoFaSchema = z.object({
  code: z.string().min(6).max(6),
})

function AutoSubmitCodeField() {
  const { onSubmit } = useFormContext()
  return <CodeField
    onCompleted={onSubmit}
  />
}

export default function SigninTwoFa() {

  const { handleSubmit, formRef } = useFormStep({
    resolver: zodResolver(twoFaSchema)
  })

  const { verify } = useSignin()

  const onSubmit: FormStepSubmitHandler = useCallback(async (data) => {
    await verify(data.code)
    return true
  }, [])

  return <AuthFormContainer
    as="form"
    title="Sécurité double authentification"
    color="secondary"
    subTitle="Merci de rentrer le code à 6 chiffres que vous avez reçu par SMS."
    footer={<div className="flex gap-2 items-center">
      <p>Pas encore reçu ? </p>
      <Button variant="plain">Renvoyer le SMS</Button>
    </div>}
    containerProps={{
      ref: formRef,
      onSubmit: handleSubmit(onSubmit)
    }}
  >
    <AutoSubmitCodeField />
  </AuthFormContainer>
}