import { apiRGP, apiTAUD } from '@/config/axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const tramitarAudienciaStore = () => {
  const minuta = ref([])

  async function tramitarAudiencia_getMinuta(payload){
    try {
      const response = await apiTAUD.get(`/minuta/${payload.idSolicitud}`)
      minuta.value = response.data
      return Promise.resolve(response.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return {
    minuta,
    tramitarAudiencia_getMinuta
  }
}

export const useTramitarAudienciaStore = defineStore('tramitarAudienciaStore', tramitarAudienciaStore, { persist: true })
