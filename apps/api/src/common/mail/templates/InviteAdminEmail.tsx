import { Html, Link, Text } from '@react-email/components'
import { useEmailContext } from '../contexts/EmailProvider'


export default function InviteAdminEmail({ url }: { url: string, }) {
  
  const { receiver } = useEmailContext()
  
  return <Html>
    <Text>Bonjour {receiver}</Text>
    <Text>Vous avez été invité à rejoindre l'équipe de Cipher-health.</Text>
    <Text>Voici le lien de l'invitation</Text>
    <Link href={url}>
      Cliquer ici !
    </Link>
  </Html>
}