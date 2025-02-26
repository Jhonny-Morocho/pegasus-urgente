import axios from 'axios'

const apiBFF2 = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL_API_BFF2,
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
function setTokenToApiBFF2 (token) {
  apiBFF2.defaults.headers.common.Authorization = 'Bearer ' + token
}

export {
  apiBFF2,
  setTokenToApiBFF2
}
