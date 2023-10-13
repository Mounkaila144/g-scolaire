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
import MenuItem from "@mui/material/MenuItem";

const EditModal = ({data, open, setOpen, setSuccess, setLoading, setError}) => {
  const [prix, setPrix] = useState(data?.prix || '');
  const [professeur, setProfesseur] = useState(data?.professeur?.id || '');
  const [dataProfesseur, setDataProfesseur] = useState([]);

  const [errorMessage, setErrorMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  useEffect(() => {
    setPrix(data?.prix || '');
    setProfesseur(data?.professeur?.id || '');
  }, [data]);

  const router = useRouter();
  const { t } = useTranslation();

  const refreshData = () => {
    router.push({ pathname: router.pathname, query: { refresh: Date.now() } });
  }
  useEffect(() => {
    const fetchData = async () => {

      try {
        const response = await MyRequest('professeurs', 'GET', {}, {'Content-Type': 'application/json'});
        if (Array.isArray(response.data)) {
          setDataProfesseur(response.data)
        } else {
          console.error("Received non-array data:", response.data);
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

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setOpen(false);
    const formData = {
      prix,
      "professeur_id":professeur,
    };

    try {
      setLoading(true);
      const response = await MyRequest('payteachers/' + data.id, 'PUT', formData, {'Content-Type': 'application/json'});
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
                  select
                  label={t("professeur")}
                  variant="outlined"
                  fullWidth
                  value={professeur}
                  onChange={(e) => setProfesseur(e.target.value)}
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
                  InputLabelProps={{
                    shrink: true,  // Cela fait en sorte que le label soit toujours réduit et donc à l'extérieur du champ
                  }}
                  variant="outlined"
                  fullWidth
                  value={prix}
                  onChange={(e) => setPrix(e.target.value)}
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
