'use client';

import Button from "@/components/Button";
import { SIGNIN_URL, SIGNUP_URL } from "@/utils/constants";
import { useRouter } from "next/navigation";


export default function Page() {

  const router = useRouter()

  return <div className="h-screen w-screen flex items-center justify-center">
    <div className="flex flex-col gap-4">
      <Button onClick={() => router.push(SIGNUP_URL)}>Inscription</Button>
      <Button onClick={() => router.push(SIGNIN_URL)}>Connexion</Button>
    </div>
  </div>
}