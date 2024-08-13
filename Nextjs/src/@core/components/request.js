import axios from 'axios';
import jwt_decode from "jwt-decode";
import themeConfig from "../../configs/themeConfig";
import authConfig from "../../configs/auth";

// Fonction de requête personnalisée
const MyRequest = async (route, method = 'GET', data = {}, headers = {}) => {
  const promotionId = localStorage.getItem('selectedPromotion') || '1';
  const token = window.localStorage.getItem(authConfig.storageTokenKeyName);

  // Décodage du token JWT
  const decoded = jwt_decode(token);
  const currentTime = new Date().getTime() / 1000; // Temps actuel en secondes

  // Vérification de l'expiration du token
  if (decoded.exp < currentTime) {
    localStorage.clear();
    authConfig.onTokenExpiration = 'logout';
    window.location.reload();
  } else {
    // Requête Axios avec configuration
    return axios({
      method: method,
      data: data,
      baseURL: `${themeConfig.url}${route}`,
      headers: {
        ...headers,
        'Authorization': `Bearer ${token}`,
        'X-Promotion': promotionId
      },
    });
  }
};

export default MyRequest;
