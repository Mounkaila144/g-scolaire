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

const EditModal = ({id,data, open, setOpen, setSuccess, setLoading, setError}) => {
  const [nom, setNom] = useState(data?.user?.nom || '');
  const [prenom, setPrenom] = useState(data?.user?.prenom || '');

  const [number, setNumber] = useState(data.number);
  const [adresse, setAdresse] = useState(data.adresse);
  const [birth, setBirth] = useState(data.birth ? new Date(data.birth) : new Date());
  const [nationalite, setNationalite] = useState(data.nationalite);
  const [genre, setGenre] = useState(data.genre);
  const [errorMessage, setErrorMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  useEffect(() => {
    console.log("Data.birth:", data.birth);
    setNom(data?.user?.nom || '');
    setPrenom(data?.user?.prenom || '');
    setAdresse(data.adresse);
    if (data.birth) {
      setBirth(new Date(data.birth));
    }
    setNationalite(data.nationalite);
    setGenre(data.genre);
    setNumber(data.number);
  }, [data]);

  const router = useRouter();
  const { t } = useTranslation();

  const refreshData = () => {
    router.push('/mkl/student/'+id+"?refresh="+Date.now());
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!nom.trim() || !prenom.trim()) {
      setErrorMessage(t('an error occurred'));
      return;
    }
    setFormSubmitted(true);
    setOpen(false);
    const formData = {
      nom,
      classe_id:id,
      prenom,
      adresse,
      genre,
      birth,
      nationalite,
      number
    };

    try {
      setLoading(true);
      const response = await MyRequest('eleves/' + data.id, 'PUT', formData, {'Content-Type': 'application/json'});
      if (response.status === 200) {
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
                  label={t("nom")}
                  InputLabelProps={{
                    shrink: true,  // Cela fait en sorte que le label soit toujours réduit et donc à l'extérieur du champ
                  }}
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
                  InputLabelProps={{
                    shrink: true,  // Cela fait en sorte que le label soit toujours réduit et donc à l'extérieur du champ
                  }}
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
                  customInput={<PickersComponent label={t('Start')}
                  />}
                />

              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField
                  label={t("adresse")}
                  InputLabelProps={{
                    shrink: true,  // Cela fait en sorte que le label soit toujours réduit et donc à l'extérieur du champ
                  }}
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
                  InputLabelProps={{
                    shrink: true,  // Cela fait en sorte que le label soit toujours réduit et donc à l'extérieur du champ
                  }}
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
                  InputLabelProps={{
                    shrink: true,  // Cela fait en sorte que le label soit toujours réduit et donc à l'extérieur du champ
                  }}
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
                  InputLabelProps={{
                    shrink: true,  // Cela fait en sorte que le label soit toujours réduit et donc à l'extérieur du champ
                  }}
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

export default EditModal;
