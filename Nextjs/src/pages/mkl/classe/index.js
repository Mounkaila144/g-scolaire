// ** React Imports
import {useState, useEffect} from 'react'
// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import {DataGrid} from '@mui/x-data-grid'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
// ** Store Imports
import {useTranslation} from 'react-i18next'
// ** Custom Table Components Imports
import MyRequest from "../../../@core/components/request";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {useRouter} from "next/router";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Add from "../../../components/classes/add";
import EditModal from "../../../components/classes/edit";
import ViewModal from "../../../components/classes/view";
import Fab from "@mui/material/Fab";
import Error401 from "../../401";
import Sucess from "../../sucess";
import Loading from "../../Loading";


// ** Icon Imports

// ** Custom Components Imports

// ** Hooks Imports
import useBgColor from 'src/@core/hooks/useBgColor'
import {formatPrice} from "../../../utils/formatPrice";
// ** renders client column

const classeList = () => {
  // ** State
  const [openadd, setOpenadd] = useState(false)
  const [openedit, setOpenedit] = useState(false)
  const [openview, setOpenview] = useState(false)
  const [openstudent, setOpenstudent] = useState(false)
  const [roleFilter, setRoleFilter] = useState('');
  const [originalData, setOriginalData] = useState([])
  const [pageSize, setPageSize] = useState(10)
  const [addclasseOpen, setAddclasseOpen] = useState(false)
  const [data, setData] = useState([]);
  const [dataclasse, setDataclasse] = useState([]);
  const [searchValue, setSearchValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false); // New state variable for success message
  const [selected, setSelected] = useState([]);


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

  const filterData = (data, searchVal, ) => {
    if (!Array.isArray(data)) {
      console.error("Data provided to filterData is not an array:", data);
      return [];
    }

    return data.filter(user =>
      user.nom.toLowerCase().includes(searchVal.toLowerCase())
    );
  };



  useEffect(() => {
    const filteredData = filterData(originalData, searchValue);
    setData(filteredData);
  }, [searchValue, originalData]);

  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await MyRequest('classes', 'GET', {}, {'Content-Type': 'application/json'});
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


  const toggleAddclasseDrawer = () => setAddclasseOpen(!addclasseOpen)
  const {t, i18n} = useTranslation()


  useEffect(() => {
    console.log(selected);
  }, [selected]);



  const columns = [
    {
      flex: 0.2,
      minWidth: 100,
      field: 'nom',
      headerName: t('Name'),
      renderCell: ({ row }) => {
        return (
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 'bold',
                    color: 'blue',
                    fontSize: '24px',
                    textShadow: '1px 1px 2px black, 0 0 25px dark, 0 0 5px dark'
                }}
            >
                {row.nom}
            </Typography>


        );
      },
    },
    {
      flex: 0.2,
      minWidth: 100,
      field: 'Schooling',
      headerName: t('Schooling'),
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
      field: 'eleves_count',
      headerName: t('Number of Students'),
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant='body2'>
            {row.eleves_count}
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
          setDataclasse(user);
          setOpenedit(true);
          handleRowOptionsClose();
        };

const handleView = (user) => {
          // Set the user data to be edited
          setDataclasse(user);
          setOpenview(true);
        };

        const Submitremove = () => {
          var data=Object.values([row.id]);

          setLoading(true)
          MyRequest('classes/'+row.id, 'DELETE', {'data':data}, {'Content-Type': 'application/json'})
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
              }}refresh
              PaperProps={{ style: { minWidth: '8rem' } }}
            >
              <MenuItem
                sx={{ '& svg': { mr: 2 } }}
                onClick={() => handleView(row)}
              >
                <Icon icon='mdi:eye-outline' fontSize={20} />
                {t('View')}
              </MenuItem>
                <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={() => {
                    router.push({
                        pathname: `/mkl/student/${row.id}`,
                        query: { nom: row.nom }
                    })
                }} >

                <Icon icon='mdi:pencil-outline' fontSize={20} />
                 {t('student')}
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
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Button variant='outlined' onClick={() => setOpenadd(true)}>
                  {t('to add')}
                </Button>
                </Box>
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
        <EditModal data={dataclasse} open={openedit} setOpen={setOpenedit} setSuccess={setSuccess} setLoading={setLoading} setError={setError}/>
        <ViewModal data={dataclasse} open={openview} setOpen={setOpenview} setSuccess={setSuccess} setLoading={setLoading} setError={setError}/>
       {/* Student user modal */}
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

export default classeList
