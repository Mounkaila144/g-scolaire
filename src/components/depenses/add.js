import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import {
  Dialog, DialogTitle, Alert, DialogContent,
  Grid, TextField, DialogActions, Button
} from "@mui/material";

import MyRequest from "../../@core/components/request";

const Add = ({id, open, setOpen ,setSuccess, setLoading,setError}) => {
  const [prix, setPrix] = useState('');
  const [details, setDetails] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);


  const router = useRouter();
  const { t } = useTranslation();


  const refreshData = () => {
    router.push({ pathname: router.pathname, query: { refresh: Date.now() } });
  }
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!prix.trim() || !details.trim()) {
      setErrorMessage(t('an error occurred'));
      return;
    }
    setFormSubmitted(true);
    setOpen(false)
    const formData = {
      prix,
      details
    };

    try {
      setLoading(true);
      const response = await MyRequest('depenses', 'POST', formData, {'Content-Type': 'application/json'});
      if (response.status === 201) {
        setSuccess(true);
        setPrix('');
        setDetailes('');
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
      maxWidth='sm'
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
              <Grid item xs={12} lg={6}>
                <TextField
                  label={t("prix")}
                  variant="outlined"
                  fullWidth
                  value={prix}
                  onChange={(e) => setPrix(e.target.value)}
                  error={formSubmitted && !prix.trim()}
                  helperText={formSubmitted && !prix.trim() ? t('is required') : ''}
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField
                  label={t("details")}
                  variant="outlined"
                  fullWidth
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  error={formSubmitted && !details.trim()}
                  helperText={formSubmitted &&  !details.trim() ? t('is required') : ''}
                />

              </Grid>

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
