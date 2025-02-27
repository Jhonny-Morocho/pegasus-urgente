<template>
<section>
  <div class="grid">
    <IdentificacionDenunciaComponent
      ref="identificacion"
      class="col-12"
      :loading="loading"
    />
    <RucRit
      ref="rucRit"
      class="col-12"
    />
  </div>
  <AppBtnNextTeleported
    label="Buscar Duplicidad"
    :loading="loadingStepSujetos"
    @click="handleSubmitForm"
  />
</section>
</template>

<script setup>
import { defineEmits, onMounted, ref } from 'vue'

import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'

import IdentificacionDenunciaComponent from '@/modules/global/components/identificacion-denuncia/IdentificacionDenunciaIdentificacionDenunciaFieldset.vue'
import RucRit from '@/modules/global/components/identificacion-denuncia/IdentificacionDenunciaRucRitFieldset.vue'
import { requestUtil } from '@/utils'

import { useIdentificacionDenunciaStore } from '@/modules/ingreso/composables'

import { useMantenedorStore, usePamStore } from '@/modules/global/composables'

const { identificacionDenuncia, identificacionDenuncia_getByIdDenuncia } = useIdentificacionDenunciaStore()
const { mantenedor_getTipoDenunciaId, mantenedor_getTiposDenuncia } = useMantenedorStore()

const { procesoPam } = usePamStore()

const identificacion = ref(null)
const rucRit = ref(null)
const loadingStepSujetos = ref(false)
const loading = ref(false)

onMounted(() => {
  mantenedor_getTiposDenuncia()
  getIdentificacionDenuncia()
})

function getIdentificacionDenuncia () {
  requestUtil({
    action: identificacionDenuncia_getByIdDenuncia,
    payload: {
      idDenuncia: procesoPam.value.idDenuncia
    },
    resolve: () => {
      setData()
    },
    loader: (l) => (loading.value = l),
    reject: (err) => {
      console.error(err)
    }
  })
}

const tipoDenunciaDirecta = mantenedor_getTipoDenunciaId('DIRECTA')
function setData () {
  identificacion.value?.populateData({
    ...identificacion.value.formData,
    ...identificacionDenuncia.value,
    idTipoDenuncia: identificacionDenuncia.value?.tipoDenuncia ?? tipoDenunciaDirecta,
    medioDeRecepcion: 'Presencial'
  })
}

const emit = defineEmits(['next-step'])

function handleSubmitForm () {
  loadingStepSujetos.value = true
  setTimeout(() => {
    loadingStepSujetos.value = false
    emit('next-step', '/ingreso/denuncia-directa/nueva-denuncia/buscar-duplicidad')
  }, 600)
}
</script>
