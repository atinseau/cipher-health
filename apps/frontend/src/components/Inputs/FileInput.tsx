'use client';

import { ChangeEvent, useState } from "react";
import BaseInput, { BaseInputProps } from "./BaseInput"
import { TbFiles } from "react-icons/tb";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { AiOutlineEye } from "react-icons/ai";
import { HiOutlineTrash } from "react-icons/hi";



type FileInputProps = {
  baseInputProps?: BaseInputProps
  isRequired?: boolean
  title: string
  subTitle?: string
  value?: File
  onChange?: (file?: File) => void
}

export default function FileInput(props: FileInputProps) {

  // Controlled
  const [internalFile, setInternalFile] = useState<File | undefined>(undefined)

  const {
    title,
    subTitle,
    value,
    isRequired,
    onChange,
    baseInputProps,
  } = props

  const file = value || internalFile

  const setFile = (file?: File) => {
    setInternalFile(file)
    onChange?.(file)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.item(0)
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  return <BaseInput {...baseInputProps} isRequired={isRequired}>
    {file && <div className="border justify-between flex rounded-sm border-indigo-500 hover:bg-indigo-300 transition-background py-4 px-2.5">
      <div className="flex items-center gap-2">
        {file.type === 'application/pdf' && <BsFileEarmarkPdf size={20} className="text-indigo-500" />}
        <p>{file.name}</p>
      </div>
      <div className="flex gap-2 text-indigo-500">
        {/* TODO: add lib to display file */}
        <AiOutlineEye size={20} className="cursor-pointer" onClick={() => console.log('view file')} />
        <HiOutlineTrash size={20} className="cursor-pointer" onClick={() => setFile(undefined)} />
      </div>
    </div>}
    {!file && <label className="border-dashed border rounded-sm border-indigo-500 hover:bg-indigo-300 transition-background cursor-pointer p-2.5 flex justify-center items-center flex-col text-center gap-2 text-indigo-400">
      <TbFiles size={24} className="text-indigo-500" />
      {title}
      {subTitle && <span className="text-sm">{subTitle}</span>}
      <input
        type="file"
        className="hidden"
        onChange={handleChange}
      />
    </label>}
  </BaseInput>

}