import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import {
  Dialog, DialogTitle, Alert, DialogContent,
  Grid, TextField, DialogActions, Button
} from "@mui/material";

import MyRequest from "../../@core/components/request";
import MenuItem from "@mui/material/MenuItem";

const Add = ({ open, setOpen ,setSuccess, setLoading,setError}) => {
  const [prix, setPrix] = useState('');
  const [professeur, setProfesseur] = useState('');
  const [dataProfesseur, setDataProfesseur] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);


  const router = useRouter();
  const { t } = useTranslation();
  useEffect(() => {
    const fetchData = async () => {

      try {
        const response = await MyRequest('professeurs', 'GET', {}, {'Content-Type': 'application/json'});
        if (Array.isArray(response.data.data)) {
          setDataProfesseur(response.data.data)
        } else {
          console.error("Received non-array data:", response.data.data);
          setError(true);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router.query]);

  const refreshData = () => {
    router.push({ pathname: router.pathname, query: { refresh: Date.now() } });
  }
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!prix.trim() || !professeur === '') {
      setErrorMessage(t('an error occurred'));
      return;
    }
    const formData = {
      prix,
      "professeur_id":professeur
    };

    try {
      setLoading(true);
      const response = await MyRequest('payteachers', 'POST', formData, {'Content-Type': 'application/json'});
      if (response.status === 201) {
        setOpen(false)
        setSuccess(true);
        setPrix('');
        setProfesseur('');
        refreshData();
      } else {
        setFormSubmitted(true);
        setError(true);
      }
    } catch (e) {
      setFormSubmitted(true);
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
                select
                label={t("professeur")}
                variant="outlined"
                fullWidth
                value={professeur}
                onChange={(e) => setProfesseur(e.target.value)}
                error={formSubmitted && professeur === ''}
                helperText={formSubmitted && professeur === '' ? t('is required') : ''}
              >
                {dataProfesseur.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.user.nom}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
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
