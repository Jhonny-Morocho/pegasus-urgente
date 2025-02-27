import axios from 'axios'

const apiESPECIEDINERO = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL_API_ESPECIEDINERO,
  headers: {
    // 'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

apiESPECIEDINERO.interceptors.request.use(function (config) {
  // DESCOMENTAR CUANDO SE AGREGE EL USER KEY A ENDPOINT DE ESECIE Y DINERO
  // config.params = { ...config.params, user_key: process.env.VUE_APP_USER_KEY }
  return config
})

/**
 * set token to header authorization
 * @param token
 */
function setTokenToApiESPECIEDINERO (token) {
  apiESPECIEDINERO.defaults.headers.common.Authorization = 'Bearer ' + token
}

export {
  apiESPECIEDINERO,
  setTokenToApiESPECIEDINERO
}
