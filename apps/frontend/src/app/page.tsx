'use client'

import PasswordInput from "@/components/inputs/PasswordInput";
import TextInput from "@/components/inputs/TextInput";
import { useEffect, useState } from "react";

export default function Page() {

  return <div className="flex p-4 gap-4 items-center">
    <PasswordInput placeholder="salut" />


    {/* <h1>Salut</h1>
    <h2>Salut</h2>
    <h3>Salut</h3>
    <h4>Salut</h4>
    <p>Salut</p> */}
  </div>
}