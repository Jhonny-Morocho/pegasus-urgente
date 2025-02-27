import axios from 'axios'

const apiRGPDev = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL_API_DEV,
  headers: {
    // 'Access-Control-Allow-Origin': '*',
    'Content-Type': 'multipart/form-data',
    Accept: 'application/json'
  }
})
apiRGPDev.interceptors.request.use(function (config) {
  config.params = { ...config.params, user_key: process.env.VUE_APP_USER_KEY }
  return config
})

/**
 * set token to header authorization
 * @param token
 */
function setTokenToApiRGPDev (token) {
  apiRGPDev.defaults.headers.common.Authorization = 'Bearer ' + token
}

export {
  apiRGPDev,
  setTokenToApiRGPDev
}
