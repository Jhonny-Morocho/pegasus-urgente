import axios from 'axios'

const apiRGPPam = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL_API_RGP_PAM,
  headers: {
    // 'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

/**
 * set token to header authorization
 * @param token
 */
function setTokenToApiRGPPam (token) {
  apiRGPPam.defaults.headers.common.Authorization = 'Bearer ' + token
}

export { apiRGPPam, setTokenToApiRGPPam }
