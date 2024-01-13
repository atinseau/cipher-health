import { FormStep } from "@/contexts/FormProvider/FormProvider";
import SignupAddress from "./Steps/SignupAddress";
import SignupMedicalInformation from "./Steps/SignupClient/SignupMedicalInformation";
import SignupInformation from "./Steps/SignupInformation";
import SignupRegistrationStep from "./Steps/SignupRegistrationStep";
import SignupTwoFa from "./Steps/SignupTwoFa";
import SignupCurriculumVitae from "./Steps/SignupWorker/SignupCurriculumVitae";
import SignupDescription from "./Steps/SignupWorker/SignupDescription";
import SignupMedicalIdentifier from "./Steps/SignupWorker/SignupMedicialIdentifier";
import SignupSignature from "./Steps/SignupWorker/SignupSignature";
import SignupSpeciality from "./Steps/SignupWorker/SignupSpeciality";



export const clientSteps: FormStep[] = [
  {
    title: "Connexion",
    components: [
      SignupRegistrationStep,
      SignupTwoFa
    ]
  },
  {
    title: "Informations",
    components: [
      SignupInformation
    ]
  },
  {
    title: "Coordonées",
    components: [
      SignupAddress
    ]
  },
  {
    title: "Prise en charge",
    components: [
      SignupMedicalInformation
    ],
  }
]

export const workerSteps: FormStep[] = [
  {
    title: "Connexion",
    components: [
      SignupRegistrationStep,
      SignupTwoFa
    ]
  },
  {
    title: "Informations",
    components: [
      SignupInformation
    ]
  },
  {
    title: "Coordonées",
    components: [
      SignupAddress
    ]
  },
  {
    title: "Prise en charge",
    components: [
      SignupMedicalIdentifier
    ],
  },
  {
    title: "Parcours",
    components: [
      SignupCurriculumVitae,
      SignupSpeciality,
      SignupSignature,
      SignupDescription,
    ]
  }
]