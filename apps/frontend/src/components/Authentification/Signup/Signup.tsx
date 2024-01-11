import StepBar from "@/components/StepBar";
import SignupRegistrationStep from "./Steps/SignupRegistrationStep";
import Button from "@/components/Button";

import { FaArrowRightLong } from "react-icons/fa6";



export default function Signup() {
  return <div className="flex flex-col justify-between h-full">
    <div className="flex flex-col gap-12">
      <StepBar
        currentStep={1}
        steps={[
          { title: "Connexion" },
          { title: "Informations" },
          { title: "Coordonées" },
          { title: "Prise en charge" },
        ]}
      />
      <SignupRegistrationStep />
    </div>

    <div className="flex justify-end">
      <Button
        isDisabled
        endContent={<FaArrowRightLong />}
      >
        Suivant
      </Button>
    </div>

  </div>
}