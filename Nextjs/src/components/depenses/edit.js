import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import {
  Dialog, DialogTitle, Alert, DialogContent,
  Grid, TextField, DialogActions, Button
} from "@mui/material";


import MyRequest from "../../@core/components/request";
import DatePickerWrapper from "../../@core/styles/libs/react-datepicker";
import DatePicker from "react-datepicker";
import PickersComponent from "../../views/forms/form-elements/pickers/PickersCustomInput";

const EditModal = ({data, open, setOpen, setSuccess, setLoading, setError}) => {
  const [prix, setPrix] = useState(data?.prix || '');
  const [details, setDetails] = useState(data?.details || '');

  const [errorMessage, setErrorMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  useEffect(() => {
    setPrix(data?.prix || '');
    setDetails(data?.details || '');
  }, [data]);

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
    const formData = {
      prix,
      details,
    };

    try {
      setLoading(true);
      const response = await MyRequest('depenses/' + data.id, 'PUT', formData, {'Content-Type': 'application/json'});
      if (response.status === 200) {
        setOpen(false)
        setSuccess(true);

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
          {t('edit')}
        </DialogTitle>
        {errorMessage && (
          <Alert variant='filled' severity='error'>
            {errorMessage}
          </Alert>
        )}
        <DialogContent>
          <DatePickerWrapper>

            <Grid container spacing={2}>
              <Grid item xs={12} lg={6}>
                <TextField
                  label={t("prix")}
                  InputLabelProps={{
                    shrink: true,  // Cela fait en sorte que le label soit toujours réduit et donc à l'extérieur du champ
                  }}
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
                  InputLabelProps={{
                    shrink: true,  // Cela fait en sorte que le label soit toujours réduit et donc à l'extérieur du champ
                  }}
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
          </DatePickerWrapper>
        </DialogContent>
      </>
    </Dialog>
  );
};

export default EditModal;
