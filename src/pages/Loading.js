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
import Spinner from "../@core/components/spinner";
import CircularProgress from "@mui/material/CircularProgress";
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

const Loading = () => {
  const { t } = useTranslation();

  return (
    <Box className='content-center'>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <CircularProgress
          size={300} // size of the spinner
          thickness={2} // thickness of the circular spinner track
          color="primary" // can be primary, secondary or inherit based on theme
          style={{ marginBottom: '16px' }} // some space below the spinner
        />
        <div>{t("Loding")} ...</div>
      </Box>
    </Box>
  )
}
Loading.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default Loading
