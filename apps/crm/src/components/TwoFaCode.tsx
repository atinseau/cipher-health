import { useCallback, useRef, useState } from "react";
import styled from "@mui/material/styles/styled";
import Box from "@mui/material/Box";


const numRegex = /^[0-9\b]+$/

const Input = styled('input')(() => ({
  width: "40px",
  height: "50px",
  borderRadius: "5px",
  border: "1px solid #E5E5E5",
  textAlign: "center",
  fontSize: "25px",
}))

export default function Code() {

  const inputRefs = useRef<HTMLInputElement[]>([])
  const [code, setCode] = useState<string[]>([])

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

  return <Box sx={{ display: "flex", gap: "5px", mt: "20px", justifyContent: "center" }}>
    {Array.from({ length: 6 }).map((_, i) => (<Input
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
    />))}
  </Box>
}