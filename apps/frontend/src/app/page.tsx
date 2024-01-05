'use client'

import Button from "@/components/Button"
import StepBar from "@/components/StepBar"
import CodeInput from "@/components/inputs/CodeInput"
import DateInput from "@/components/inputs/DateInput"
import PasswordInput from "@/components/inputs/PasswordInput"
import TextAreaInput from "@/components/inputs/TextAreaInput"
import TextInput from "@/components/inputs/TextInput"

import { AiOutlineMail } from "react-icons/ai"

export default function Page() {

  return <div className="flex p-4 gap-10 flex-col items-center">

    <p>Salut tout le monde CA MARCHE PAS PTN</p>

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


    <CodeInput onChange={(e) => {
      console.log(e)
    }} />


    <div className="flex gap-2">
      <Button variant="bordered">Se connecter</Button>
      <Button variant="bordered" isDisabled>Se connecter</Button>

      <Button variant="solid">Se connecter</Button>
      <Button variant="solid" isDisabled>Se connecter</Button>
    </div>

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