import Box from "@mui/material/Box";

type SignupContainerProps = {
  children: React.ReactNode
}

export default function SignupContainer({ children }: SignupContainerProps) {
  return <Box sx={{
    display: 'flex',
    justifyContent: 'center',
    height: '100vh',
    backgroundImage: 'radial-gradient(circle at 50% 14em, #313264 0%, #00023b 60%, #00023b 100%)'
  }}>
    <Box sx={{
      mt: '6rem',
      padding: '16px',
      backgroundColor: '#121212',
      boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
      backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
      minHeight: 200,
      maxWidth: 350,
      display: 'flex',
      flexDirection: 'column',
      height: 'fit-content',
    }}>
      {children}
    </Box>
  </Box>
}