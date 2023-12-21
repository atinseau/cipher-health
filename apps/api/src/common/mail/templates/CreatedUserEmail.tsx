import { Html, Text } from '@react-email/components'


export default function CreatedUserEmail({ name }: { name: string }) {
  return <Html>
    <Text>Salut tout le monde</Text>
  </Html>
}