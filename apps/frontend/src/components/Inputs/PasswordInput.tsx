'use client';

import { useCallback, useMemo, useState } from "react";
import TextInput, { TextInputProps } from "./TextInput";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { Progress } from "@nextui-org/progress";


import {
  containLowerCaseLetters,
  containNumbers,
  containSpecialChar,
  containUpperCaseLetters
} from '@cipher-health/utils'
import clsx from "clsx";


type PasswordInputProps = TextInputProps & {
  enableStrength?: boolean
}

export default function PasswordInput(props: PasswordInputProps) {

  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const EndComponent = useMemo(() => {
    return showPassword ? AiOutlineEyeInvisible : AiOutlineEye
  }, [showPassword])

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.onChange) {
      props.onChange(e)
    }

    if (!props.enableStrength) {
      return
    }

    const value = e.target.value

    let strength = 0


    if (value.length >= 8) {
      strength += (100 / 5)
    }

    if (containUpperCaseLetters(value)) {
      strength += (100 / 5)
    }

    if (containLowerCaseLetters(value)) {
      strength += (100 / 5)
    }

    if (containNumbers(value)) {
      strength += (100 / 5)
    }

    if (containSpecialChar(value)) {
      strength += (100 / 5)
    }

    setPasswordStrength(strength)

  }, [])

  return <div className="w-full">
    <TextInput
      {...props}
      onChange={handlePasswordChange}
      type={showPassword ? "text" : "password"}
      endContent={<EndComponent
        className="text-indigo-500 cursor-pointer"
        size="18px"
        onClick={() => setShowPassword(!showPassword)}
      />}
    />
    {props.enableStrength && <div className="text-gray-600 text-xs flex gap-1 items-center mt-2">
      <span className="whitespace-nowrap">Sécurité :</span>
      <Progress aria-label="password progression" value={passwordStrength} classNames={{
        base: 'h-[4px]',
        indicator: clsx({
          '!bg-danger': passwordStrength <= 50,
          '!bg-warning': passwordStrength > 50 && passwordStrength <= 90,
          '!bg-success': passwordStrength > 90,
        })
      }} />
    </div>}
  </div>
} 