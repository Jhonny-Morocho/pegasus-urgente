import axios from 'axios'

const apiRGPchat = axios.create({
  baseURL: process.env.VUE_APP_CHAT_URL,
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
function setTokenToApiRGPchat (token) {
  apiRGPchat.defaults.headers.common.Authorization = 'Bearer ' + token
  console.log(setTokenToApiRGPchat)
}

export {
  apiRGPchat,
  setTokenToApiRGPchat
}
