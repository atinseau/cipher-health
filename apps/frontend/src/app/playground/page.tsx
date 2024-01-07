import Button from "@/components/Button"
import StepBar from "@/components/StepBar"
import CodeInput from "@/components/Inputs/CodeInput"
import DateInput from "@/components/Inputs/DateInput"
import PasswordInput from "@/components/Inputs/PasswordInput"
import TextAreaInput from "@/components/Inputs/TextAreaInput"
import TextInput from "@/components/Inputs/TextInput"

import { AiOutlineMail } from "react-icons/ai"

export default function Page() {

  return <div className="flex p-4 gap-10 flex-col items-center">

    <div className="flex gap-2 flex-col items-center">
      <p>Filled (default)</p>

      <div className="flex gap-2">
        <Button>Se connecter</Button>
        <Button isDisabled>Se connecter</Button>
      </div>

      <div className="flex gap-2">
        <Button variant="filled" color="secondary">Se connecter</Button>
        <Button variant="filled" color="secondary" isDisabled>Se connecter</Button>
      </div>

    </div>

    <div className="flex gap-2 flex-col items-center">
      <p>Outlined</p>

      <div className="flex gap-2">
        <Button variant="outlined">Se connecter</Button>
        <Button variant="outlined" isDisabled>Se connecter</Button>
      </div>

    </div>

    <div className="flex gap-2 flex-col items-center">
      <p>Plain</p>

      <div className="flex gap-2">
        <Button variant="plain">Se connecter</Button>
        <Button variant="plain" isDisabled>Se connecter</Button>
      </div>

    </div>


    <DateInput />

    <StepBar
      currentStep={1}
      steps={[
        { title: "Connexion" },
        { title: "Informations" },
        { title: "Coordonées" },
        { title: "Prise en charge" },
      ]}
    />


    <CodeInput />

    <PasswordInput defaultValue="091209" placeholder="password" />

    <TextAreaInput
      label="Salut"
      placeholder="placeholder"
      helperText="helperText"
      subLabel="subLabel"
    />

    <TextInput
      label="Salut"
      placeholder="placeholder"
      helperText="helperText"
      subLabel="subLabel"
      endContent={<AiOutlineMail className="text-indigo-500" />}
    />


    {/* <h1>Salut</h1>
    <h2>Salut</h2>
    <h3>Salut</h3>
    <h4>Salut</h4>
    <p>Salut</p> */}
  </div>
}