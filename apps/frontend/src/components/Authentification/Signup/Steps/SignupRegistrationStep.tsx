import PasswordInput from "@/components/Inputs/PasswordInput";
import TextInput from "@/components/Inputs/TextInput";
import AutocompleteInput from "@/components/Inputs/AutocompleteInput";
import InputGroup from "@/components/Inputs/InputGroup";

import { AiOutlineMail } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { Divider } from "@nextui-org/divider";
import AuthFormContainer from "../../AuthFormContainer";

import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema } from "@cipher-health/utils/schemas";
import z from "zod";
import { useFormStep } from "@/components/Form/hooks/useFormStep";
import { COUNTRIES } from "@cipher-health/utils";
import { Controller } from "react-hook-form";
import useFormError from "@/components/Form/hooks/useFormError";

const defaultValues = {
  "email": "arthurtinseau@live.fr",
  "password": "06112001..Arttsn",
  "confirmPassword": "06112001..Arttsn",
  "phone": "0782887672",
  "country": "FR"
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default function SignupRegistrationStep() {

  const {
    handleSubmit,
    register,
    formState,
    formRef,
    control,
  } = useFormStep<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues
  })

  const { getError } = useFormError(formState)

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {

    throw new Error('test')

    return data
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
      <TextInput
        baseInputProps={{
          label: "Votre email de connexion :"
        }}
        placeholder="Votre email"
        isRequired
        endContent={<AiOutlineMail className="text-indigo-500" />}
        {...register("email")}
        {...getError("email")}
      />

      <PasswordInput
        baseInputProps={{
          label: "Votre mot de passe :"
        }}
        placeholder="Votre mot de passe"
        enableStrength
        isRequired
        {...register('password')}
        {...getError("password")}
      />

      <TextInput
        baseInputProps={{
          label: "Confirmez votre mot de passe"
        }}
        placeholder="Votre mot de passe"
        isRequired
        endContent={<RxCross1 className="text-red-500" size={20} />}
        {...register('confirmPassword')}
        {...getError("confirmPassword")}
      />

      <Divider />

      <InputGroup className="flex gap-6" baseInputProps={{
        label: "Votre numéro de téléphone",
        subLabel: "Votre pays est nécessaire pour valider votre numéro de téléphone"
      }}>

        <TextInput
          isRequired
          type="tel"
          placeholder="Numéro de téléphone"
          {...register('phone')}
          {...getError("phone")}
        />

        <Controller
          name="country"
          control={control}
          render={({ field }) => <AutocompleteInput
            items={COUNTRIES.map((country) => ({
              label: country.label,
              value: country.code
            }))}
            defaultValue={field.value}
            classNames={{
              content: "max-h-[150px]"
            }}
            onChange={(e) => field.onChange(e)}
            placeholder="Votre pays"
            textInputProps={{
              isRequired: true,
              ...getError('country')
            }}
          />}
        />

      </InputGroup>
    </form>

  </AuthFormContainer>
}