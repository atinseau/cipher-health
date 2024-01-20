import InformationCard from "@/components/Card/InformationCard";
import AuthFormContainer from "../../AuthFormContainer";
import { useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormStepSubmitHandler, useFormStep } from "@cipher-health/form";
import RadioField from "@/components/Fields/RadioField";
import TextField from "@/components/Fields/TextField";
import DateField from "@/components/Fields/DateField";
import { informationSchema } from "@cipher-health/utils/schemas";


// const defaultValues = {
//   "gender": "FEMALE",
//   "firstName": "qsdd",
//   "lastName": "qsd",
//   "birthDate": "1984-10-09T23:00:00.000Z",
//   "birthPlace": "qsdqsd",
//   "birthName": "qsd"
// }

export default function SignupInformation() {

  const { handleSubmit, formRef } = useFormStep({
    resolver: zodResolver(informationSchema),
    // defaultValues,
  })

  const onSubmit: FormStepSubmitHandler = useCallback(async () => {
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