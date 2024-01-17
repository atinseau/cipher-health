import InformationCard from "@/components/Card/InformationCard";
import AuthFormContainer from "../../AuthFormContainer";
import { FormStepSubmitHandler, useFormStep } from "@/contexts/FormProvider/hooks/useFormStep";
import { useCallback } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import RadioField from "@/contexts/FormProvider/Fields/RadioField";
import TextField from "@/contexts/FormProvider/Fields/TextField";
import DateField from "@/contexts/FormProvider/Fields/DateField";
import { getMinimalMajorBirthDate } from "@cipher-health/utils";

const informationSchema = z.object({
  gender: z.enum(['MALE', 'FEMALE']),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  birthDate: z.coerce.date().max(getMinimalMajorBirthDate(), {
    message: "Vous devez être majeur"
  }),
  birthPlace: z.string().min(1).optional(),
  birthName: z.string().optional(),
})

const defaultValues = {
  "gender": "FEMALE",
  "firstName": "qsd",
  "lastName": "qsd",
  "birthDate": new Date("1984-10-09T23:00:00.000Z"),
  "birthPlace": "qsdqsd",
  "birthName": "qsd"
}

export default function SignupInformation() {

  const { handleSubmit, formRef } = useFormStep({
    resolver: zodResolver(informationSchema),
    mode: 'onChange',
    defaultValues
  })

  const onSubmit: FormStepSubmitHandler = useCallback(async (data) => {
    console.log(data)
    return true
  }, [])

  return <AuthFormContainer
    title="Lorem ipsum"
    variant="full"
  >
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

      <RadioField
        name="gender"
        items={[
          { label: "Un Homme", value: "MALE" },
          { label: "Une femme", value: "FEMALE" },
        ]}
        radioInputProps={{
          label: "Vous êtes :",
          subLabel: "La réglementation du système de santé français nous oblige à vous demander cette information.",
          isRequired: true,
          orientation: "horizontal"
        }}
      />

      <div className="flex gap-6">

        <TextField
          name="firstName"
          textInputProps={{
            baseInputProps: {
              label: "Prénom :"
            },
            placeholder: "Votre prénom",
            isRequired: true
          }}
        />

        <TextField
          name="lastName"
          textInputProps={{
            baseInputProps: {
              label: "Nom :"
            },
            placeholder: "Votre nom",
            isRequired: true
          }}
        />

      </div>

      <div className="flex gap-6">
        <TextField
          name="birthName"
          textInputProps={{
            baseInputProps: {
              label: "Nom de naissance :"
            },
            placeholder: "Votre nom de naissance"
          }}
        />

        <DateField
          name="birthDate"
          dateInputProps={{
            baseInputProps: {
              label: "Date de naissance :"
            },
            placeholder: "Votre date de naissance",
            autoClose: true,
            isRequired: true
          }}
        />
      </div>


      <TextField
        name="birthPlace"
        textInputProps={{
          baseInputProps: {
            label: "Lieu de naissance :"
          },
          placeholder: "Département, ville, pays",
          isRequired: true
        }}
      />
    </form>

    <InformationCard>
      <p>Les informations ci-dessus seront transmises au médecin lors des RDV</p>
    </InformationCard>
  </AuthFormContainer>

}