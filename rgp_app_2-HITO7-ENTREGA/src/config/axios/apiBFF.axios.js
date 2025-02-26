import axios from 'axios'

const apiBFF = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL_API_BFF,
  headers: {
    // 'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

apiBFF.interceptors.request.use(function (config) {
  config.params = { ...config.params, user_key: process.env.VUE_APP_USER_KEY }
  return config
})

/**
 * set token to header authorization
 * @param token
 */
function setTokenToApiBFF (token) {
  apiBFF.defaults.headers.common.Authorization = 'Bearer ' + token
}

export {
  apiBFF,
  setTokenToApiBFF
}
