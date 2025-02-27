import axios from 'axios'

const apiTAUD = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL_API_TRAMITARAUDIENCIA,
  headers: {
    // 'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

apiTAUD.interceptors.request.use(function (config) {
  config.params = { ...config.params, user_key: process.env.VUE_APP_USER_KEY }
  return config
})
/**
 * set token to header authorization
 * @param token
 */
function setTokenToApiTAUD (token) {
  apiTAUD.defaults.headers.common.Authorization = 'Bearer ' + token
}

export { apiTAUD, setTokenToApiTAUD }
