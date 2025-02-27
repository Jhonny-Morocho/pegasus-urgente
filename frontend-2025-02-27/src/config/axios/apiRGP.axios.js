import axios from 'axios'

const apiRGP = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL_API_RGP,
  headers: {
    // 'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

apiRGP.interceptors.request.use(function (config) {
  config.params = { ...config.params, user_key: process.env.VUE_APP_USER_KEY }
  return config
})
/**
 * set token to header authorization
 * @param token
 */
function setTokenToApiRGP (token) {
  apiRGP.defaults.headers.common.Authorization = 'Bearer ' + token
}

export { apiRGP, setTokenToApiRGP }
