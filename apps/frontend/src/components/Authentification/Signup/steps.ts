import type { FormStep } from "@cipher-health/form";
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
import MobileSignupGender from "./Steps/Mobile/MobileSignupGender";
import MobileSignupInformation from "./Steps/Mobile/MobileSignupInformation";
import MobileSignupBirth from "./Steps/Mobile/MobileSignupBirth";

export const mobileClientSteps: FormStep[] = [
  {
    title: 'Identifiants de connexion',
    keepValues: false,
    components: [
      SignupRegistrationStep,
      SignupTwoFa,
    ]
  },
  {
    title: "Informations",
    prev: {
      scoped: true
    },
    components: [
      MobileSignupGender,
      MobileSignupInformation,
      MobileSignupBirth
    ]
  },
  {
    title: "Votre adresse",
    prev: {
      global: true
    },
    components: [
      SignupAddress
    ]
  },
  {
    title: "Votre prise en charge",
    prev: {
      global: true
    },
    components: [
      SignupMedicalInformation
    ]
  }
]

export const clientSteps: FormStep[] = [
  {
    title: "Connexion",
    keepValues: false,
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
    prev: {
      global: true
    },
    components: [
      SignupAddress
    ]
  },
  {
    title: "Prise en charge",
    prev: {
      global: true
    },
    components: [
      SignupMedicalInformation
    ],
  }
]

export const workerSteps: FormStep[] = [
  {
    title: "Connexion",
    keepValues: false,
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