
import { AiOutlineMail } from "react-icons/ai";
import { Divider } from "@nextui-org/divider";
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema } from "@cipher-health/utils/schemas";
import { useFormStep } from "@/components/Form/hooks/useFormStep";

import PasswordConfirmationField from "@/components/Form/Fields/PasswordConfirmationField";
import TextField from "@/components/Form/Fields/TextField";
import PasswordField from "@/components/Form/Fields/PasswordField";
import CountryField from "@/components/Form/Fields/CountryField";
import AuthFormContainer from "../../AuthFormContainer";
import InputGroup from "@/components/Inputs/InputGroup";

import { useAuthentificator } from '@cipher-health/sdk/react'

import z from "zod";


const defaultValues = {
  "email": "arthurtinseau@live.fr",
  "password": "06112001..Arttsn",
  "confirmPassword": "06112001..Arttsn",
  "phone": "0782887672",
  "country": "FR"
}


export default function SignupRegistrationStep() {

  const { handleSubmit, formRef } = useFormStep<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues,
  })
  
  const authentificator = useAuthentificator()

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    // throw new Error('test')

    authentificator.signup(data)
  }

  return <AuthFormContainer
    title="Lorem ipsum"
    variant="full"
  >
    <form
      className="flex flex-col gap-6"
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextField
        name="email"
        textInputProps={{
          isRequired: true,
          endContent: <AiOutlineMail className="text-indigo-500" />,
          placeholder: "Votre email",
          baseInputProps: {
            label: "Votre email de connexion :"
          }
        }}
      />
      <PasswordField />
      <PasswordConfirmationField />
      <Divider />
      <InputGroup className="flex gap-6" baseInputProps={{
        label: "Votre numéro de téléphone",
        subLabel: "Votre pays est nécessaire pour valider votre numéro de téléphone"
      }}>
        <TextField
          name="phone"
          textInputProps={{
            isRequired: true,
            placeholder: "Numéro de téléphone",
            type: "tel",
          }}
        />
        <CountryField />
      </InputGroup>
    </form>
  </AuthFormContainer>
}