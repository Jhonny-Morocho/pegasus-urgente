import axios from 'axios'

const apiRGPDesaIdDenuncia = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL_API_RGP_DENUNCIA,
  headers: {
    // 'Access-Control-Allow-Origin': '*',
    // 'Content-Type': 'application/json',
    // Accept: 'application/json'
  }
})

/**
 * set token to header authorization
 * @param token
 */
function setTokenToApiRGPDesaIdDenuncia (token) {
  apiRGPDesaIdDenuncia.defaults.headers.common.Authorization = 'Bearer ' + token
}

export {
  apiRGPDesaIdDenuncia,
  setTokenToApiRGPDesaIdDenuncia
}
