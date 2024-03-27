import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CustomAvatar from "../../@core/components/mui/avatar";
import Typography from "@mui/material/Typography";
import CustomChip from "../../@core/components/mui/chip";
import Box from "@mui/material/Box";
import Icon from "../../@core/components/icon";
import Divider from "@mui/material/Divider";
import {useTranslation} from "react-i18next";
import {red} from "@mui/material/colors";


const roleColors = {
  admin: 'error',
  client: 'info',
  author: 'warning',
  maintainer: 'success',
  subscriber: 'primary'
}


const ViewModal = ({ open, setOpen, data }) => {
  const handleClose = () => {
    setOpen(false);
  };

  const renderClient = row => {
    if (row.role === "superadmin") {
      return <CustomAvatar src={"/images/avatars/3.png"} variant='rounded'
                           alt={data.nom}
                           sx={{width: 120, height: 120, fontWeight: 600, mb: 4, fontSize: '3rem'}}/>
    } else {
      return <CustomAvatar src={"/images/avatars/1.png"} variant='rounded'
                           alt={data.nom}
                           sx={{width: 120, height: 120, fontWeight: 600, mb: 4, fontSize: '3rem'}}/>
    }
  }
  const {t, i18n} = useTranslation()

  if (data.user) {
    return (
      <Dialog
        maxWidth="sm"
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title" sx={{ textAlign: 'center' }}>{t('view')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{pt: 15, display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                    {renderClient(data)}
                  <Typography variant='h6' sx={{mb: 2}}>
                    {data.user.nom} {data.user.prenom}
                  </Typography>
                  <CustomChip
                    skin='light'
                    size='small'
                    label={data.classe&&data.classe.nom}
                    color={roleColors["admin"]}
                    sx={{
                      height: 20,
                      fontWeight: 600,
                      borderRadius: '5px',
                      fontSize: '0.875rem',
                      textTransform: 'capitalize',
                      '& .MuiChip-label': {mt: -0.25}
                    }}
                  />
                  <Box sx={{ mb: 2 }}>
                    <CustomChip
                      skin='light'
                      size='small'
                      label= {t('Username')}
                      color={'info'}
                      sx={{
                        height: 20,
                        fontWeight: 600,
                        borderRadius: '5px',
                        fontSize: '0.875rem',
                        textTransform: 'capitalize',
                        '& .MuiChip-label': {mt: -0.25}
                      }}
                    />
                    <Typography
                      variant='h6'
                      component="span"
                      sx={{
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '0.8rem'  // ajuste la taille comme tu le souhaites
                      }}
                    >
                      : {data.user.username}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <CustomChip
                      skin='light'
                      size='small'
                      label= {t('Initial Password')}
                      color={'info'}
                      sx={{
                        height: 20,
                        fontWeight: 600,
                        borderRadius: '5px',
                        fontSize: '0.875rem',
                        textTransform: 'capitalize',
                        '& .MuiChip-label': {mt: -0.25}
                      }}
                    />
                    <Typography
                      variant='h6'
                      component="span"
                      sx={{
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '0.8rem'  // ajuste la taille comme tu le souhaites
                      }}
                    >
                      : {data.user.passwordinit}
                    </Typography>
                  </Box>

                </CardContent>

              </Card>
            </Grid>
          </Grid>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('close')}</Button>
        </DialogActions>
      </Dialog>
    );
  }
};

export default ViewModal;
