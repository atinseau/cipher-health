'use client';

import Image from "next/image";
import BaseInput, { BaseInputProps } from "./BaseInput";
import Button from "../Button";
import { IoCameraOutline } from "react-icons/io5";
import { useState } from "react";
import clsx from "clsx";


type AvatarInputProps = {
  baseInputProps?: BaseInputProps
  value?: File
  onChange?: (file?: File) => void
}

export default function AvatarInput(props: AvatarInputProps) {

  const {
    value,
    onChange,
    baseInputProps
  } = props

  // Controlled
  const [internalFile, setInternalFile] = useState<File | undefined>(undefined)

  const file = value || internalFile
  const setFile = (file?: File) => {
    setInternalFile(file)
    onChange?.(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const getCurrentImage = () => {
    if (file) {
      return URL.createObjectURL(file)
    }
    return "/assets/svg/avatar.svg"
  }

  return <BaseInput {...baseInputProps}>
    <div className="relative flex w-[160px] h-[160px]">
      <div className="relative w-full h-full overflow-hidden border border-indigo-400 rounded-full  bg-indigo-300">
        <Image
          src={getCurrentImage()}
          priority
          alt="Avatar"
          fill
          className={clsx("next-image-reset", {
            "object-[0,10px]": !file,
            "object-contain": file,
          })}
        />
      </div>
      <Button
        as="label"
        customSize
        className="!rounded-full p-2 absolute bottom-[5px] right-[5px]"
        startContent={<IoCameraOutline size={20} />}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          hidden
        />
      </Button>
    </div>
  </BaseInput>

}