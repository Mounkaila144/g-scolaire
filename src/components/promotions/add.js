import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

// ** MUI Imports
import Box from '@mui/material/Box'

// ** Third Party Imports
import subDays from 'date-fns/subDays'
import addDays from 'date-fns/addDays'
import DatePicker from 'react-datepicker'

// ** Custom Component Imports
import {
  Dialog, DialogTitle, Alert, DialogContent,
  Grid, TextField, DialogActions, Button
} from "@mui/material";

import MyRequest from "../../@core/components/request";
import PickersComponent from "../../views/forms/form-elements/pickers/PickersCustomInput";

const Add = ({ open, setOpen ,setSuccess, setLoading,setError}) => {
  const [debut, setDebut] = useState(new Date());
  const [fin, setFin] = useState(new Date());
  const [errorMessage, setErrorMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);


  const router = useRouter();
  const { t } = useTranslation();

  const refreshData = () => {
    router.push({ pathname: router.pathname, query: { refresh: Date.now() } });
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!debut.trim() || !fin.trim()) {
      setErrorMessage(t('an error occurred'));
      return;
    }
    setFormSubmitted(true);
    setOpen(false)
    const formData = {
      debut,
      fin
    };

    try {
      setLoading(true);
      const response = await MyRequest('classes', 'POST', formData, {'Content-Type': 'application/json'});
      if (response.status === 201) {
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
      maxWidth='lg'
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby='form-dialog-title'
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
            <Grid container spacing={2}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                <div>
                  <DatePicker
                    id='debut-date'
                    selected={debut}
                    onChange={date => setDebut(date)}
                    customInput={<PickersComponent label='Debut' />}
                    dateFormat="yyyy"
                    showYearPicker
                  />
                </div>
                <div>
                  <DatePicker
                    id='fin-date'
                    selected={fin}
                    onChange={date => setFin(date)}
                    customInput={<PickersComponent label='Fin' />}
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
          </DialogContent>
        </>
    </Dialog>
  );
};

export default Add;
