
import { AiOutlineMail } from "react-icons/ai";
import { Divider } from "@nextui-org/divider";
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema } from "@cipher-health/utils/schemas";

import AuthFormContainer from "../../AuthFormContainer";
import InputGroup from "@/components/Inputs/InputGroup";

import z from "zod";
import useSignup from "@/contexts/AuthProvider/hooks/useSignup";
import { FormStepSubmitHandler, useFormStep } from "@cipher-health/form";
import TextField from "@/components/Fields/TextField";
import PasswordField from "@/components/Fields/PasswordField";
import PasswordConfirmationField from "@/components/Fields/PasswordConfirmationField";
import CountryField from "@/components/Fields/CountryField";

const defaultValues = {
  "email": "arthurtinseau@live.fr",
  "password": "06112001..Arttsn",
  "confirmPassword": "06112001..Arttsn",
  "phone": "0782887672",
  "country": "FR"
}

export default function SignupRegistrationStep() {

  const { handleSubmit, formRef, setErrors } = useFormStep<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues,
  })

  const signup = useSignup()

  const onSubmit: FormStepSubmitHandler<z.infer<typeof signupSchema>> = async (data) => {

    const [_, errors] = await signup(data)

    if (errors) {
      setErrors(errors)
      return false
    }

    return true
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
        <CountryField name="country" />
      </InputGroup>
    </form>
  </AuthFormContainer>
}