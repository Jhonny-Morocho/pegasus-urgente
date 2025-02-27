import axios from 'axios'

const axiosDireccion = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL_API_DIRECCION
})

export { axiosDireccion }
