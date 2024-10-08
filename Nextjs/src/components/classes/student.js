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
import Add from "./add";
import EditModal from "./edit";
import ViewModal from "./view";


// ** renders client column
const renderClient = row => {
  if (row.role === "superadmin") {
    return <CustomAvatar src={"/images/avatars/3.png"} sx={{mr: 3, width: 34, height: 34}}/>
  } else {
    return <CustomAvatar src={"/images/avatars/1.png"} sx={{mr: 3, width: 34, height: 34}}/>
  }
}

const StudentModal = ({dataClass, open, setOpen ,setSuccess, setLoading,setError}) => {
  // ** State
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


  //DETED

  const refreshData = () => {
    router.push({pathname: router.pathname, query: {refresh: Date.now()}});
  }

  //filtre
  const handleSearchChange = event => {
    const value = event.target.value;
    setSearchValue(value);
    const filteredData = filterData(originalData, value, roleFilter);
    setData(filteredData);
  };

  const filterData = (data, searchVal, roleVal) => {
    if (!Array.isArray(data)) {
      console.error("Data provided to filterData is not an array:", data);
      return [];
    }

    return data.filter(user =>
      user.nom.toLowerCase().includes(searchVal.toLowerCase()) &&
      (roleVal === '' || user.role.toLowerCase() === roleVal.toLowerCase())
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

  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await MyRequest(`classes/eleves/${dataClass.id}`, 'GET', {}, {'Content-Type': 'application/json'});
        if (Array.isArray(response.data.data)) {
          setOriginalData(response.data.data);
          setData(response.data.data);
        } else {
          console.error("Received non-array data:", response.data.data);
          setError("Une erreur est survenue lors du traitement des données.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Une erreur est survenue lors de la récupération des données.");
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
      maxWidth: 80,
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
      minWidth: 100,
      field: 'username',
      headerName: t("Username"),
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant='body2'>
            {row.user.username}
          </Typography>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 100,
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
      minWidth: 100,
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
      minWidth: 100,
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
      flex: 0.1,
      minWidth: 90,
      sortable: false,
      field: 'actions',
      headerName: t('action'),
      renderCell: ({ row }) => {
        const [anchorEl, setAnchorEl] = useState(null);
        const rowOptionsOpen = Boolean(anchorEl);

        const handleRowOptionsClick = (event) => {
          setAnchorEl(event.currentTarget);
        };

        const handleRowOptionsClose = () => {
          setAnchorEl(null);
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
          MyRequest('users/'+row.id, 'DELETE', {'data':data}, {'Content-Type': 'application/json'})
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
      <Add open={openadd} setOpen={setOpenadd} setSuccess={setSuccess} setLoading={setLoading} setError={setError}/>
      <EditModal data={dataUser} open={openedit} setOpen={setOpenedit} setSuccess={setSuccess} setLoading={setLoading} setError={setError}/>
      <ViewModal data={dataUser} open={openview} setOpen={setOpenview} setSuccess={setSuccess} setLoading={setLoading} setError={setError}/>
      {/* View user modal */}


    </Grid>
  )
}

export default StudentModal
