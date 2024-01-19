'use client';

import useUser from "@/contexts/AuthProvider/hooks/useUser";

export default function DashboardPage() {

  const { user } = useUser()

  return <pre>{JSON.stringify(user, null, 2)}</pre>

}