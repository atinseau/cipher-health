'use client';

import Button from "@/components/Button";
import useSignout from "@/contexts/AuthProvider/hooks/useSignout";
import useUser from "@/contexts/AuthProvider/hooks/useUser";

export default function DashboardPage() {

  const { user } = useUser()

  const signout = useSignout()

  return <div>
    <Button onClick={signout}>Signout</Button>
    <pre>{JSON.stringify(user, null, 2)}</pre>
  </div>

}