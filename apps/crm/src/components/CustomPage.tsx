import Paper from "@mui/material/Paper";
import styled from "@mui/material/styles/styled";
import Box from "@mui/material/Box";

type CustomPageProps = {
  children: React.ReactNode
  isBooted?: boolean
}

const Root = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  height: "100vh",
  backgroundImage: "radial-gradient(circle at 50% 14em, #313264 0%, #00023b 60%, #00023b 100%)",
}))

export const CustomPageContainer = styled(Paper)(({ theme }) => ({
  marginTop: '6rem',
  padding: '16px',
  minHeight: 200,
  maxWidth: 350,
  display: 'flex',
  flexDirection: 'column',
  height: 'fit-content',
}))

export default function CustomPage({ children, isBooted }: CustomPageProps) {
  return <Root>
    {isBooted && children}
  </Root>
}