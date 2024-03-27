import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import {
  Dialog, DialogTitle, Alert, DialogContent,
  Grid, TextField, DialogActions, Button
} from "@mui/material";

import MyRequest from "../../@core/components/request";
import addDays from "date-fns/addDays";
import PickersComponent from "../../views/forms/form-elements/pickers/PickersCustomInput";
import DatePicker from "react-datepicker";
import DatePickerWrapper from "../../@core/styles/libs/react-datepicker";

const Add = ({id, open, setOpen ,setSuccess, setLoading,setError}) => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [number, setNumber] = useState('');
  const [adresse, setAdresse] = useState('');
  const [birth, setBirth] = useState(new Date());
  const [nationalite, setNationalite] = useState('');
  const [genre, setGenre] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);


  const router = useRouter();
  const { t } = useTranslation();


  const refreshData = () => {
    router.push({ pathname: router.pathname, query: { refresh: Date.now() } });
  }
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!nom.trim() || !prenom.trim() || !adresse.trim() || !genre.trim() || !nationalite.trim() || !number.trim()) {
      setErrorMessage(t('an error occurred'));
      return;
    }
    setFormSubmitted(true);
    const formData = {
      nom,
      prenom,
      adresse,
      genre,
      birth,
      nationalite,
      number
    };

    try {
      setLoading(true);
      const response = await MyRequest('professeurs', 'POST', formData, {'Content-Type': 'application/json'});
      if (response.status === 201) {
        setSuccess(true);
        setNom('');
        setPrenom('');
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
          <DatePickerWrapper>

            <Grid container spacing={2}>
              <Grid item xs={12} lg={6}>
                <TextField
                  label={t("nom")}
                  variant="outlined"
                  fullWidth
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  error={formSubmitted && !nom.trim()}
                  helperText={formSubmitted && !nom.trim() ? t('is required') : ''}
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField
                  label={t("prenom")}
                  variant="outlined"
                  fullWidth
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  error={formSubmitted && !prenom.trim()}
                  helperText={formSubmitted &&  !prenom.trim() ? t('is required') : ''}
                />

              </Grid>
              <Grid item xs={12} lg={6}>
                <DatePicker
                  id='Date'
                  selected={birth}
                  onChange={date => setBirth(date)}
                  customInput={<PickersComponent label={t('Start')} />}
                />

              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField
                  label={t("adresse")}
                  variant="outlined"
                  fullWidth
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  error={formSubmitted && !adresse.trim()}
                  helperText={formSubmitted &&  !adresse.trim() ? t('is required') : ''}
                />

              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField
                  label={t("number")}
                  variant="outlined"
                  fullWidth
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  error={formSubmitted && !number.trim()}
                  helperText={formSubmitted &&  !number.trim() ? t('is required') : ''}
                />

              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField
                  label={t("nationalite")}
                  variant="outlined"
                  fullWidth
                  value={nationalite}
                  onChange={(e) => setNationalite(e.target.value)}
                  error={formSubmitted && !nationalite.trim()}
                  helperText={formSubmitted &&  !nationalite.trim() ? t('is required') : ''}
                />

              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField
                  label={t("genre")}
                  variant="outlined"
                  fullWidth
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  error={formSubmitted && !genre.trim()}
                  helperText={formSubmitted &&  !genre.trim() ? t('is required') : ''}
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

export default Add;
