// ** React Imports
import { useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

// ** Hook Imports
import { useAuth } from 'src/hooks/useAuth'


const Home = () => {
  // ** Hooks
  const auth = useAuth()
  console.log("User",auth.user)
  console.log("Role",auth.user.role)
  const router = useRouter()
  useEffect(() => {
    if (auth.user && auth.user.role) {

      // Redirect user to Home URL
      router.replace('/mkl')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Spinner sx={{ height: '100%' }} />
}

export default Home
