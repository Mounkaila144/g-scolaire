import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

// ** MUI Imports
import Box from '@mui/material/Box'

// ** Third Party Imports
import subDays from 'date-fns/subDays'
import addDays from 'date-fns/addDays'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Custom Component Imports
import {
  Dialog, DialogTitle, Alert, DialogContent,
  Grid, TextField, DialogActions, Button
} from "@mui/material";

import MyRequest from "../../@core/components/request";
import PickersComponent from "../../views/forms/form-elements/pickers/PickersCustomInput";
import IconButton from "@mui/material/IconButton";
import Icon from "../../@core/components/icon";

const EditModal = ({data, open, setOpen, setSuccess, setLoading, setError}) => {
  const [debut, setDebut] = useState(new Date(data.debut, 0)); // Le mois de janvier est 0
  const [fin, setFin] = useState(new Date(data.fin, 0)); // Assurez-vous que data.fin est géré de manière similaire

  const [errorMessage, setErrorMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);


  useEffect(() => {
    // Assurez-vous de créer des instances de Date valides lors de la mise à jour de data
    if (data) {
      setDebut(new Date(data.debut, 0)); // 0 pour janvier, ajuste pour le début de l'année
      setFin(new Date(data.fin, 0)); // Supposant que data.fin est également une année
    }
  }, [data]);
  const router = useRouter();
  const { t } = useTranslation();

  const refreshData = () => {
    router.push({ pathname: router.pathname, query: { refresh: Date.now() } });
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!debut || !fin) {
      setErrorMessage(t('an error occurred'));

      return;
    }
    setFormSubmitted(true);
    setOpen(false)
    const yearDebut = debut.getFullYear();
    const yearFin = fin.getFullYear();

    const formData = {
      'debut':yearDebut,
      'fin':yearFin
    };

    try {
      setLoading(true);
      const response = await MyRequest('promotions', 'PUT', formData, {'Content-Type': 'application/json'});
      if (response.status === 201) {
        setOpen(false)
        setSuccess(true);
        setDebut('');
        setFin('');
        refreshData();
      } else {
        setError(true);
      }
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
      <Dialog
          fullWidth
          minWidth='xl'
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby='form-dialog-title'
          sx={{ "& .MuiDialog-paper": { minHeight: '400px', minWidth: '600px' } }} // Modifie ces valeurs selon tes besoins
      >

        <>
          <DialogTitle id='form-dialog-title' sx={{ textAlign: 'center' }}>
            {t('add')}
          </DialogTitle>
          {errorMessage && (
              <Alert variant='filled' severity='error'>
                {errorMessage}
              </Alert>
          )}
          <DialogContent>
            <IconButton size='small' onClick={() => setOpen(false)} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
              <Icon icon='mdi:close' />
            </IconButton>
            <DatePickerWrapper>

              <Grid container spacing={2}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                  <div>
                    <DatePicker
                        id='debut-date'
                        selected={debut}
                        maxDate={fin} // Ici, maxDate est ajusté pour être égal à `fin`
                        onChange={date => setDebut(date)}
                        customInput={<PickersComponent label={t('Start')} />}
                        dateFormat="yyyy"
                        showYearPicker
                    />
                  </div>
                  <div>
                    <DatePicker
                        id='fin-date'
                        selected={fin}
                        minDate={debut}
                        onChange={date => setFin(date)}
                        customInput={<PickersComponent label={t('End')} />}
                        dateFormat="yyyy"
                        showYearPicker
                    />
                  </div>
                </Box>
                <Grid item xs={12}>
                  <DialogActions className='dialog-actions-dense'>
                    <Button onClick={onSubmit}>{t('ok')}</Button>
                  </DialogActions>
                </Grid>
              </Grid>
            </DatePickerWrapper>
          </DialogContent>
        </>
      </Dialog>
  );
};

export default EditModal;
