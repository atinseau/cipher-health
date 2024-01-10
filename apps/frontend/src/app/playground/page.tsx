'use client';

import Button from "@/components/Button"
import StepBar from "@/components/StepBar"
import CodeInput from "@/components/Inputs/CodeInput"
import DateInput from "@/components/Inputs/DateInput"
import PasswordInput from "@/components/Inputs/PasswordInput"
import TextAreaInput from "@/components/Inputs/TextAreaInput"
import TextInput from "@/components/Inputs/TextInput"

import { AiOutlineMail } from "react-icons/ai"
import RadioInput from "@/components/Inputs/RadioInput"
import Select from "@/components/Select"
import FileInput from "@/components/Inputs/FileInput"
import { useState } from "react";

export default function Page() {

  const [file, setFile] = useState<File | undefined>(undefined)

  return <div className="flex p-4 gap-10 flex-col items-center">


    <div className="flex flex-col gap-6">
      <FileInput
        title="Upload your file"
        subTitle=".png, .pdf or .jpeg (5Mo max)"
        value={file}
        onChange={setFile}
      />
      <p>Controlled FileInput: {file?.name}</p>
    </div>


    <Select
      placeholder="Select item"
      label="Select item"
      helperText="helperText"
      subLabel="subLabel"
      isRequired
      items={[
        { label: "Item 1", value: "item-1" },
        { label: "Item 2", value: "item-2" },
        { label: "Item 3", value: "item-3" },
      ]}
    />

    <DateInput />

    <div className="flex gap-8 flex-col items-center">
      <RadioInput
        label="Select your favorite city"
        orientation="horizontal"
        items={[
          { label: "Buenos Aires", value: "buenos-aires" },
          { label: "Sydney", value: "sydney" },
          { label: "San Francisco", value: "san-francisco" },
          { label: "London", value: "london" },
          { label: "Tokyo", value: "tokyo" },
        ]}
      />

      <RadioInput
        label="Vous êtes :"
        subLabel="La réglementation du système de santé français nous oblige à vous demander cette information."
        isRequired
        orientation="horizontal"
        items={[
          { label: "Un Homme", value: "MALE" },
          { label: "Une femme", value: "FEMALE" },
        ]}
      />
    </div>

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
  </div>
}