'use client';

import classNames from "classnames"
import { useCallback, useEffect, useRef, useState } from "react"


const numRegex = /^[0-9\b]+$/

type CodeInputProps = {
  onChange?: (code: string) => void
  minLength?: number
}

export default function CodeInput({ onChange, minLength = 6 }: CodeInputProps) {

  const inputRefs = useRef<HTMLInputElement[]>([])
  const [code, setCode] = useState<string[]>([])


  useEffect(() => {
    if (!onChange)
      return

    const codeString = code.join('')
    if (codeString.length >= minLength) {
      onChange(codeString)
    }
  }, [code])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    if (!numRegex.test(e.target.value)) {
      e.target.value = ''
      setCode((prev) => {
        const newCode = [...prev]
        newCode[i] = undefined as any
        return newCode
      })
      return
    }

    if (i > 0 && e.target.value.length === 0) {
      inputRefs.current[i - 1].focus()
    }

    if (i < inputRefs.current.length - 1 && inputRefs.current[i + 1].value === '') {
      inputRefs.current[i + 1].focus()
    }

    setCode((prev) => {
      const newCode = [...prev]
      newCode[i] = e.target.value
      return newCode
    })
  }, [code])

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData.getData('text')
    if (!numRegex.test(pastedData) && pastedData.length !== 6) {
      e.preventDefault()
      return
    }
    pastedData.split('').forEach((char, i) => {
      inputRefs.current[i].value = char
      setCode((prev) => {
        const newCode = [...prev]
        newCode[i] = char
        return newCode
      })
    })
    inputRefs.current[pastedData.length - 1].focus()
  }, [])


  return <div className="flex gap-6">
    {Array.from({ length: 6 }).map((_, i) => (<input
      key={i}
      maxLength={1}
      onPaste={handlePaste}
      onKeyDown={(e) => {
        if (e.key === 'Backspace' && i > 0 && e.currentTarget.value.length === 0) {
          inputRefs.current[i - 1].focus()
        }
      }}
      ref={(ref) => inputRefs.current[i] = ref!}
      onChange={(e) => handleInputChange(e, i)}
      className={classNames("w-[48px] h-[64px] bg-indigo-300 rounded-lg text-center text-2xl")}
    />))}
  </div>
}