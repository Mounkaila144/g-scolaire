// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrations from 'src/views/pages/misc/FooterIllustrations'
import {useTranslation} from "react-i18next";

// ** Styled Components
const BoxWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw'
  }
}))

const Img = styled('img')(({ theme }) => ({
  marginTop: theme.spacing(15),
  marginBottom: theme.spacing(15),
  [theme.breakpoints.down('lg')]: {
    height: 450,
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(10)
  },
  [theme.breakpoints.down('md')]: {
    height: 400
  }
}))

const Error401 = () => {
  const { t } = useTranslation();

  return (
    <Box className='content-center'>
      <Box sx={{  display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <BoxWrapper>

          <Typography variant='h5' sx={{ mb: 2.5, fontSize: '1.5rem !important' }}>
            {t("An error occurred")}! 🔐
          </Typography>
        </BoxWrapper>
        <Img alt='error-illustration' src='/images/pages/401.png' />

      </Box>
      <FooterIllustrations image='/images/pages/misc-401-object.png' />
    </Box>
  )
}
Error401.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default Error401
