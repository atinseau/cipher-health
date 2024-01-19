import Button from "@/components/Button";
import AuthFormContainer from "../../AuthFormContainer";
import { useCallback } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useSignupInfo from "../hooks/useSignupInfo";
import useVerify from "@/contexts/AuthProvider/hooks/useVerify";
import { useMount } from '@cipher-health/utils/react'
import { FormStepSubmitHandler, useFormStep } from "@cipher-health/form";
import CodeField from "@/components/Fields/CodeField";
import { getSecretPhoneNumber } from "@cipher-health/utils";

const twoFaSchema = z.object({
  code: z.string().min(6).max(6),
})

export default function SignupTwoFa() {

  const [signupInfo] = useSignupInfo()
  const { send, verify } = useVerify()

  const { handleSubmit, formRef } = useFormStep({
    resolver: zodResolver(twoFaSchema)
  })

  useMount(() => {
    if (signupInfo?.status === 'USER_NOT_VERIFIED' && !signupInfo.codeSent) {
      // send sms
      send()
    }
  })

  const onSubmit: FormStepSubmitHandler = useCallback((data) => {
    return verify(data.code)
  }, [])

  const phone = signupInfo?.status === 'USER_NOT_VERIFIED' ? signupInfo.phone : ''

  return <AuthFormContainer
    title="Lorem ipsum"
    subTitle={phone ? "Merci de rentrer le code reçu par sms au " + getSecretPhoneNumber(phone) + " pour vous connecter " : undefined}
    variant="full"
    classNames={{
      header: "flex flex-col gap-8",
      headerSubTitle: "text-base text-black text-center",
      content: "items-center"
    }}
    footer={
      <><div className="flex gap-2 items-center">
        <p>Pas encore reçu ? </p>
        <Button variant="plain">Renvoyer le SMS</Button>
      </div>
      </>
    }
  >
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
      <CodeField />
    </form>
  </AuthFormContainer>
}