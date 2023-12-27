import { Paper, styled } from "@mui/material";
import Box from "@mui/material/Box";

type SignupContainerProps = {
  children: React.ReactNode
  isBooted?: boolean
}

const Root = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  height: "100vh",
  backgroundImage: "radial-gradient(circle at 50% 14em, #313264 0%, #00023b 60%, #00023b 100%)",
}))

const Container = styled(Paper)(({ theme }) => ({
  marginTop: '6rem',
  padding: '16px',
  minHeight: 200,
  maxWidth: 350,
  display: 'flex',
  flexDirection: 'column',
  height: 'fit-content',
}))

export default function SignupContainer({ children, isBooted }: SignupContainerProps) {
  return <Root>
    {isBooted && <Container>
      {children}
    </Container>}
  </Root>
}