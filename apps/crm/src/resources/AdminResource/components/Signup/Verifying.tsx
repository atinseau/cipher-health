import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LockPersonIcon from '@mui/icons-material/LockPerson';
import Box from "@mui/material/Box";
import styled from "@mui/material/styles/styled";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useClient } from "@cipher-health/sdk/react";
import { useNotify } from "react-admin";
import { codeSent, expiredCodeError } from "./errors";
import { Container } from "./SignupContainer";

const Input = styled('input')(({ theme }) => ({
  width: "40px",
  height: "50px",
  borderRadius: "5px",
  border: "1px solid #E5E5E5",
  textAlign: "center",
  fontSize: "25px",
}))

const numRegex = /^[0-9\b]+$/


export default function Verifying({ stwt, checkProgress }: {
  stwt: string,
  checkProgress: () => Promise<any>
}) {

  const client = useClient()
  const notify = useNotify()

  const inputRefs = useRef<HTMLInputElement[]>([])

  const [code, setCode] = useState<string[]>([])

  async function verify() {
    // check if a verification code has been sent
    const progress = await checkProgress()
    if (!progress?.codeSent && progress?.status === 'USER_NOT_VERIFIED') {
      const [res, error] = await client.get('/auth/verify', {
        query: {
          stwt
        }
      })

      if (error) {
        console.log(error)
        return
      }
      notify(codeSent)
    }
  }

  useEffect(() => {
    verify()
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

  const handleSubmit = useCallback(async () => {
    const finalCode = code.join('')
    const [res, error] = await client.post('/auth/verify/callback', {
      body: {
        code: finalCode
      },
      query: {
        stwt
      }
    })
    if (error && (error.status === 400 || error.status === 408)) {
      notify(expiredCodeError)
      return
    }
    checkProgress()
  }, [code])

  const canSubmit = useMemo(() => {
    return code.length === 6 && code.every((char) => char !== undefined && numRegex.test(char))
  }, [code])

  return <Container>
    <Box component="form" sx={{ pt: "10px" }}>

      <Box sx={{ display: "flex", flexDirection: 'column', alignItems: 'center' }}>
        <LockPersonIcon fontSize={"large"} sx={{ mb: "10px" }} />
        <Typography variant="h6">Confirmer votre compte</Typography>
        <Typography variant="body2" color="GrayText">
          Nous allons vous envoyer un sms au numéro de téléphone que vous avez renseigné.
          Merci de bien vouloir renseigner le code que vous allez recevoir.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: "5px", mt: "20px", justifyContent: "center" }}>
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


      <Box sx={{ mt: "20px" }}>
        <Typography variant="body2" color="GrayText">
          Votre code est valide pendant 5 minutes.
        </Typography>
        <Typography variant="body2" color="GrayText">
          Code non reçu ? <a href="#" onClick={() => verify()}>Renvoyer</a>
        </Typography>
      </Box>

      <Button disabled={!canSubmit} sx={{ mt: "25px", width: "100%" }} variant="contained" onClick={handleSubmit}>
        Confirmer
      </Button>
    </Box>
  </Container>
}