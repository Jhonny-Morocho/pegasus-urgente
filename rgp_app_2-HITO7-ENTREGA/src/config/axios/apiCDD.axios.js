import axios from 'axios'

const apiCDD = axios.create({
  baseURL: `${process.env.VUE_APP_BASE_URL_API_CDD}/cdd/`,
  headers: {
    // 'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

const apiCDD2 = axios.create({
  baseURL: `${process.env.VUE_APP_BASE_URL_API_CDD}`,
  headers: {
    // 'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

const apiFilenet = axios.create({
  baseURL: `${process.env.VUE_APP_BASE_URL_API_CDD}/filenet/`,
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
function setTokenToApiCDD (token) {
  apiCDD.defaults.headers.common.Authorization = 'Bearer ' + token
  apiCDD2.defaults.headers.common.Authorization = 'Bearer ' + token
  apiFilenet.defaults.headers.common.Authorization = 'Bearer ' + token
}

export { apiCDD, apiFilenet, setTokenToApiCDD, apiCDD2 }
