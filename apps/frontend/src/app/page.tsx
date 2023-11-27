import { getServerSession } from "next-auth";
import { signIn, signOut } from "@/utils/auth/auth.client";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Page() {

  const session = await getServerSession(authOptions)

  if (session) {
    return (
      <>
        Signed in as {session.user?.email} <br />
        <button onClick={signOut}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={signIn}>Sign in</button>
    </>
  )

}