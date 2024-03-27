import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import {
  Dialog, DialogTitle, Alert, DialogContent,
  Grid, TextField, DialogActions, Button
} from "@mui/material";


import MyRequest from "../../@core/components/request";

const EditModal = ({data, open, setOpen, setSuccess, setLoading, setError}) => {
  const [nom, setNom] = useState(data.nom);
  const [prenom, setPrenom] = useState(data.prenom);
  const [errorMessage, setErrorMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    setNom(data.nom);
    setPrenom(data.prenom);
  }, [data]);

  const router = useRouter();
  const { t } = useTranslation();

  const refreshData = () => {
    router.push({ pathname: router.pathname, query: { refresh: Date.now() } });
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
      prenom
    };

    try {
      setLoading(true);
      const response = await MyRequest('users/' + data.id, 'PUT', formData, {'Content-Type': 'application/json'});
      if (response.status === 200) {
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
          Modifier
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

export default EditModal;
