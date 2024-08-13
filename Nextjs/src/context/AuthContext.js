// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      console.log(storedToken)
      if (storedToken) {
        console.log("stored")
        setLoading(true)
        await axios
          .get(authConfig.meEndpoint, {
            headers: {
              Authorization: `Bearer ${storedToken}` // Ajouter le token JWT dans les en-têtes
            }
          })
          .then(async response => {
            setLoading(false)
            setUser({ ...response.data.data.user})
            console.log('userme' ,response.data.data.user)
          })
          .catch(() => {
            localStorage.removeItem('userData')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)
            if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
              router.replace('/login')
            }
          })
      } else {
        console.log(" not stored")
        setLoading(false)
        router.replace('/mkl')
      }
    }
    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const handleLogin = (params, errorCallback) => {
    axios
        .post(authConfig.loginEndpoint, params)
        .then(response => {
          // Log pour le développement. Vous pouvez le retirer plus tard.
          console.log('la réponse :', response);


          // Stockage de l'access_token dans localStorage
          window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.data.access_token);


          setUser(response.data.data.user);

          window.localStorage.setItem('userData', JSON.stringify(response.data.data.user));

          // Redirection basée sur l'URL de retour, si elle existe
          const returnUrl = router.query.returnUrl || '/';
          const redirectURL = returnUrl !== '/' ? returnUrl : '/';
          router.replace(redirectURL);
        })
        .catch(err => {
          // Appel de la fonction de rappel d'erreur personnalisée, si elle est fournie
          if (errorCallback) errorCallback(err);
        });
  };



  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const handleRegister = (params, errorCallback) => {
    axios
      .post(authConfig.registerEndpoint, params)
      .then(res => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error)
        } else {
          handleLogin({ email: params.email, password: params.password })
        }
      })
      .catch(err => (errorCallback ? errorCallback(err) : null))
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
