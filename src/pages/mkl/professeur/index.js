// ** React Imports
import {useState, useEffect} from 'react'
// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import {DataGrid} from '@mui/x-data-grid'
import {styled} from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
// ** Store Imports
import {useTranslation} from 'react-i18next'
// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
// ** Custom Table Components Imports
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {useRouter} from "next/router";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

import Fab from "@mui/material/Fab";
import Sucess from "../../sucess";
import Loading from "../../Loading";
import Error401 from "../../401";
import MyRequest from "../../../@core/components/request";
import Add from "../../../components/professeurs/add";
import EditModal from "../../../components/professeurs/edit";
import ViewModal from "../../../components/professeurs/view";


// ** renders client column
const renderClient = row => {
  if (row.role === "superadmin") {
    return <CustomAvatar src={"/images/avatars/3.png"} sx={{mr: 3, width: 34, height: 34}}/>
  } else {
    return <CustomAvatar src={"/images/avatars/1.png"} sx={{mr: 3, width: 34, height: 34}}/>
  }
}

const StudentModal = ({}) => {
  // ** State
  const router = useRouter();  // Initialize router here
  const [openadd, setOpenadd] = useState(false)
  const [openedit, setOpenedit] = useState(false)
  const [openview, setOpenview] = useState(false)
  const [roleFilter, setRoleFilter] = useState('');
  const [originalData, setOriginalData] = useState([])
  const [pageSize, setPageSize] = useState(10)
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [data, setData] = useState([]);
  const [dataUser, setDataUser] = useState([]);
  const [searchValue, setSearchValue] = useState('')
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
  const handleSearchChange = event => {
    const value = event.target.value;
    setSearchValue(value);
    const filteredData = filterData(originalData, value, roleFilter);
    setData(filteredData);
  };
console.log(id)
  const filterData = (data, searchVal, roleVal) => {
    if (!Array.isArray(data)) {
      console.error("Data provided to filterData is not an array:", data);
      return [];
    }

    return data.filter(professeur =>
      professeur.user.nom.toLowerCase().includes(searchVal.toLowerCase())||
      professeur.user.prenom.toLowerCase().includes(searchVal.toLowerCase())||
      professeur.adresse.toLowerCase().includes(searchVal.toLowerCase())||
      professeur.number.toLowerCase().includes(searchVal.toLowerCase())
    );
  };



  const handleRoleFilterChange = event => {
    const value = event.target.value;
    setRoleFilter(value);
  };

  useEffect(() => {
    const filteredData = filterData(originalData, searchValue, roleFilter);
    setData(filteredData);
  }, [searchValue, roleFilter, originalData]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await MyRequest(`professeurs`, 'GET', {}, {'Content-Type': 'application/json'});
        if (Array.isArray(response.data.data)) {
          setOriginalData(response.data.data);
          setData(response.data.data);
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


  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)
  const {t, i18n} = useTranslation()


  useEffect(() => {
    console.log(selected);
  }, [selected]);



  const columns = [
    {
      flex: 0.2,
      minWidth: 80,
      field: 'icon',
      headerName: t(''),
      renderCell: ({ row }) => {

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row)}
          </Box>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 200,
      field: 'professeurname',
      headerName: t("Username"),
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant='body2'>
            {row.user.professeurname}
          </Typography>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 200,
      field: 'prenom',
      headerName: t('First Name'),
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant='body2'>
            {row.user.prenom}
          </Typography>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 200,
      field: 'nom',
      headerName: t('Last Name'),
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant='body2'>
            {row.user.nom}
          </Typography>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 200,
      field: 'password',
      headerName: t('Initial Password'),
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant='body2'>
            {row.user.passwordinit}
          </Typography>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 200,
      field: 'number',
      headerName: t('Number'),
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant='body2'>
            {row.number}
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


        const handleEdit = (professeur) => {
          // Set the professeur data to be edited
          setDataUser(professeur);
          setOpenedit(true);
          handleRowOptionsClose();
        };

        const handleView = (professeur) => {
          // Set the professeur data to be edited
          setDataUser(professeur);
          setOpenview(true);
        };

        const Submitremove = () => {
          var data=Object.values([row.id]);

          setLoading(true)
          MyRequest('professeurs/'+row.id, 'DELETE', {'data':data}, {'Content-Type': 'application/json'})
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
              <MenuItem
                sx={{ '& svg': { mr: 2 } }}
                onClick={() => handleView(row)}
              >
                <Icon icon='mdi:eye-outline' fontSize={20} />
                {t('View')}
              </MenuItem>
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

  return (
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
            <Box sx={{display: 'flex', alignItems: 'center', marginRight: 6, marginBottom: 2}}>

              <TextField
                size='small'
                value={searchValue}
                placeholder={t('search')}
                onChange={handleSearchChange}
                sx={{flex: 1}}
              />

            </Box>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
              <TextField
                select
                size='small'
                value={roleFilter}
                onChange={handleRoleFilterChange}
                label={t("role")}
                sx={{minWidth: 150}}
              >
                <MenuItem value=''>{t("all")}</MenuItem>
                <MenuItem value={t('superadmin')}>{t('admins')}</MenuItem>
                <MenuItem value={t('client')}>{t('clients')}</MenuItem>
              </TextField>
              <Button variant='outlined' onClick={() => setOpenadd(true)}>
                {t('to add')}
              </Button>





            </Box>
          </Box>
          {/*liste*/}
          <DataGrid
            autoHeight
            rows={data}
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
       {/*View professeur modal */}

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
  )
}

export default StudentModal
