import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import {useState, useEffect} from 'react'
import CustomAvatar from "../../@core/components/mui/avatar";
import Typography from "@mui/material/Typography";
import IconButton from '@mui/material/IconButton'
import Box from "@mui/material/Box";
import Icon from "../../@core/components/icon";
import {DataGrid} from '@mui/x-data-grid'
import {useTranslation} from "react-i18next";
import {useRouter} from "next/router";
import Add from "../scolarites/add";
import EditModal from "../scolarites/edit";
import ViewModal from "../scolarites/view";
import Sucess from "../../pages/sucess";
import Loading from "../../pages/Loading";
import Error401 from "../../pages/401";
import MyRequest from "../../@core/components/request";
import {formatPrice} from "../../utils/formatPrice";
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Fab from "@mui/material/Fab";



const ScolaireModal = ({ open, setOpen, data }) => {
  // ** State
  const router = useRouter();  // Initialize router here
  const [openadd, setOpenadd] = useState(false)
  const [openedit, setOpenedit] = useState(false)
  const [openview, setOpenview] = useState(false)
  const [originalData, setOriginalData] = useState([])
  const [pageSize, setPageSize] = useState(10)
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [data2, setData2] = useState([]);
  const [dataUser, setDataUser] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false);
  const [anchorEls, setAnchorEls] = useState({});
  const { id } = router.query;

  //DETED

  const refreshData = () => {
    router.push({pathname: router.pathname, query: {refresh: Date.now()}});
  }
  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => {
        setSuccess(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }
    if (error) {
      const timeout = setTimeout(() => {
        setError(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [success,error]);

  //filtre

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await MyRequest('scolarites', 'GET', {}, {'Content-Type': 'application/json'});
        if (Array.isArray(response.data.data)) {
          setOriginalData(response.data.data);
          setData2(response.data.data);
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


  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)
  const {t, i18n} = useTranslation()



  const columns = [

    {
      flex: 0.2,
      minWidth: 200,
      field: 'prix',
      headerName: t("Price"),
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant='body2'>
            {formatPrice(row.prix)}
          </Typography>
        );
      },
    },

    {
      flex: 0.2,
      minWidth: 100,
      field: 'Date',
      headerName: t('Date'),
      renderCell: ({ row }) => {
        const date = new Date(row.created_at);
        const formattedDate = date.toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        return (
          <Typography noWrap variant='body2'>
            {formattedDate}
          </Typography>
        );
      },
    },

    {
      flex: 0.1,
      minWidth: 90,
      sortable: false,
      field: 'actions',
      headerName: t('action'),
      renderCell: ({ row }) => {
        const anchorEl = anchorEls[row.id];
        const rowOptionsOpen = Boolean(anchorEl);

        const handleRowOptionsClick = (event) => {
          setAnchorEls({
            ...anchorEls,
            [row.id]: event.currentTarget
          });
        };

        const handleRowOptionsClose = () => {
          setAnchorEls({
            ...anchorEls,
            [row.id]: null
          });
        };


        const handleEdit = (user) => {
          // Set the user data to be edited
          setDataUser(user);
          setOpenedit(true);
          handleRowOptionsClose();
        };

        const handleView = (user) => {
          // Set the user data to be edited
          setDataUser(user);
          setOpenview(true);
        };

        const Submitremove = () => {
          var data=Object.values([row.id]);

          setLoading(true)
          MyRequest('scolarites/'+row.id, 'DELETE', {'data':data}, {'Content-Type': 'application/json'})
            .then(async (response) => {
              if (response.status === 204) {
                await refreshData()
                setSuccess(true)

              } else {
                setError(true)
              }
            }).finally(() =>{
            setLoading(false)

          })
            .catch(error => {
              setError(true)
            });
          handleRowOptionsClose();
        };


        return (
          <>
            <IconButton size='small' onClick={handleRowOptionsClick}>
              <Icon icon='mdi:dots-vertical' />
            </IconButton>
            <Menu
              keepMounted
              anchorEl={anchorEl}
              open={rowOptionsOpen}
              onClose={handleRowOptionsClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{ style: { minWidth: '8rem' } }}
            >
              <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={() => handleEdit(row)}>
                <Icon icon='mdi:pencil-outline' fontSize={20} />
                {t('Edit')}
              </MenuItem>
              <MenuItem onClick={()=>Submitremove()} sx={{ '& svg': { mr: 2 } }}>
                <Icon icon='mdi:delete-outline' fontSize={20} />
                {t('Delete')}
              </MenuItem>
            </Menu>
          </>
        );
      },
    },
  ];

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

  if (data.user) {
    return (
      <Dialog
        fullWidth={true}
        maxWidth="xl"
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title" sx={{ textAlign: 'center' }}>{t('view')}</DialogTitle>

        <DialogContent>
          <Grid container spacing={6}>

            <Grid item xs={12}>
              <Card>
                {/*filtre et post*/}
                <Box sx={{
                  p: 5,
                  pb: 3,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>

                  {selected.length > 0 && <Fab  aria-label='delect selelcted' color='error' size='medium'
                                                onClick={SubmitremoveAll}
                  >
                    <Icon icon='ic:baseline-delete' fontSize={30} />
                  </Fab>}

                  <Box sx={{display: 'flex', alignItems: 'center'}}>

                    <Button variant='outlined' onClick={() => setOpenadd(true)}>
                      {t('to add')}
                    </Button>

                    <Button variant='outlined' sx={{color:'red'}} onClick={() => setOpenadd(true)}>
                      {t('generer la facture')}
                    </Button>



                  </Box>
                </Box>
                {/*liste*/}
                <DataGrid
                  autoHeight
                  rows={data2}
                  columns={columns}
                  pageSize={pageSize}
                  rowsPerPageOptions={[5,10, 25, 50]}
                  disableSelectionOnClick
                  onSelectionModelChange={(ids) => {
                    setSelected(ids);
                  }}
                  selectionModel={selected}
                  sx={{'& .MuiDataGrid-columnHeaders': {borderRadius: 1}}}
                  onPageSizeChange={newPageSize => setPageSize(newPageSize)}
                />

              </Card>
            </Grid>
            {/*add new*/}
            <Add id={id} open={openadd} setOpen={setOpenadd} setSuccess={setSuccess} setLoading={setLoading} setError={setError}/>
            <EditModal  id={id}  data={dataUser} open={openedit} setOpen={setOpenedit} setSuccess={setSuccess} setLoading={setLoading} setError={setError}/>
            <ViewModal  id={id}  data={dataUser} open={openview} setOpen={setOpenview} setSuccess={setSuccess} setLoading={setLoading} setError={setError}/>
            {/*View user modal */}

            <Dialog
              fullWidth
              open={success}
              maxWidth='md'
              scroll='body'
            >
              <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
                <Sucess/>
              </DialogContent>
            </Dialog>
            <Dialog
              fullWidth
              open={loading}
              maxWidth='md'
              scroll='body'
            >
              <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
                <Loading/>
              </DialogContent>
            </Dialog>
            <Dialog
              fullWidth
              open={error}
              maxWidth='md'
              scroll='body'
            >
              <DialogContent sx={{pb: 6, px: {xs: 8, sm: 15}, pt: {xs: 8, sm: 12.5}, position: 'relative'}}>
                <Error401/>
              </DialogContent>
            </Dialog>

          </Grid>


        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('close')}</Button>
        </DialogActions>
      </Dialog>
    );
  }
};

export default ScolaireModal;
