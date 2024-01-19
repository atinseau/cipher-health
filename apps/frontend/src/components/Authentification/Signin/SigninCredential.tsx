import AuthFormContainer from "../AuthFormContainer";
import { AiOutlineMail } from "react-icons/ai";
import { FormStepSubmitHandler, useFormStep, useValidForm } from "@cipher-health/form";
import { useCallback } from "react";
import useSignin from "@/contexts/AuthProvider/hooks/useSignin";
import TextField from "@/components/Fields/TextField";
import PasswordField from "@/components/Fields/PasswordField";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SigninCredentialFooter from "./SigninCredentialFooter";

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})


const defaultValues = {
  email: "arthurtinseau@live.fr",
  password: "06112001..Arttsn"
}

export default function SigninCredential() {

  const { handleSubmit } = useFormStep({
    resolver: zodResolver(signinSchema),
    defaultValues
  })

  const { signin } = useSignin()
  const onSubmit: FormStepSubmitHandler = useCallback(async (data) => {
    await signin(data.email, data.password)
    return true
  }, [])

  return <AuthFormContainer
    as="form"
    title="Connectez-vous pour prendre rendez-vous"
    subTitle="Lorem ipsum dolor sit amet consectetur. Neque magna viverra vel nullam arcu sollicitudin."
    footer={<SigninCredentialFooter />}
    containerProps={{
      onSubmit: handleSubmit(onSubmit)
    }}
  >
    <div className="w-full flex flex-col gap-8">
      <TextField
        name="email"
        textInputProps={{
          placeholder: "Votre Email",
          endContent: <AiOutlineMail className="text-indigo-500" />,
          baseInputProps: {
            label: "Email :"
          },
        }}
      />
      <PasswordField
        passwordInputProps={{
          placeholder: "Votre mot de passe",
          baseInputProps: {
            label: "Mot de passe :",
            subLabel: {
              value: "Mot de passe oublié ? ",
              action: () => console.log('forgot password')
            }
          }
        }}
      />
    </div>
  </AuthFormContainer>

}