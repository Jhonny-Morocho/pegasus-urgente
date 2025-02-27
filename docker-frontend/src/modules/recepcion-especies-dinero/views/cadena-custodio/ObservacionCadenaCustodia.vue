<template>
<PageHeader
  class="mb-5"
  :items-menu-superior="itemsMenuSuperior"

  page-title="Agregar Observación a Cadena de Custodia"
/>
<AppFieldset legend="Búsqueda por NUE">
  <div class="p-fluid w-full">
    <Nue
      class="col-12 md:col-4 mb-4"
      :label="'Ingrese NUE'"
      :loading="nueLoader"
      @buscar-nue="busquedaNue"
    />
  </div>
</AppFieldset>
<section
  v-if="formData.nueEncontrado"
  class="pb-5"
>
  <Rotulo />
  <AppFieldset
    class="col-12"
    :collapsed="!toggleEvidencia"
    legend="Evidencias"
    :toggleable="true"
  >
    <TablaEvidencias
      :show="false"
      :value="evidencias"
    />
  </AppFieldset>
  <EslabonesDeCadenaCustodia
    :collapsed="!toggleEslabones"
    :toggleable="true"
  />
  <TablaObservacionesCadenaCustodio
    :collapsed="!toggleObservaciones"
    :toggleable="true"
    :value="observaciones"
  />

  <AppFieldset
    class="col-12"
    legend="Ingresar Observación a la Cadena de Custodia"
  >
    <AppTextarea
      id="observacionCadenaCustodia"
      v-model="formData.observacionCadenaCustodia"
      cols="170"
      label="Observación a la Cadena de Custodia"
      rows="4"
    />
  </AppFieldset>
</section>
<AppFooterBtns
  :button-next-disabled="!formData.nueEncontrado"
  label="Ingresar Observación"
  @back-step="handleBackStep"
  @next-step="ingresarObservacion()"
/>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

// components
import Rotulo from '@/modules/recepcion-especies-dinero/components/global/Rotulo.vue'
// import Evidencias from '@/modules/recepcion-especies-dinero/components/levantar-cadena-custodia/Evidencias.vue'
import ModalIngresarObservacion from '@/modules/recepcion-especies-dinero/components/levantar-cadena-custodia/modals/ModalIngresarObservacion.vue'
import EslabonesDeCadenaCustodia from '@/modules/recepcion-especies-dinero/components/ver-cadena-custodia/EslabonesDeCadenaCustodia.vue'
import AppFooterBtns from '@/modules/global/components/utilities/AppFooterBtns.vue'
import ModalNueNoAsignadoOEnUso from '@/modules/recepcion-especies-dinero/components/levantar-cadena-custodia/modals/ModalNueNoAsignadoOEnUso.vue'
import Nue from '@/modules/recepcion-especies-dinero/components/global/Nue.vue'
import TablaEvidencias from '@/modules/recepcion-especies-dinero/components/levantar-cadena-custodia/TablaEvidencias.vue'
import TablaObservacionesCadenaCustodio from '@/modules/recepcion-especies-dinero/components/ver-cadena-custodia/TablaObservacionesCadenaCustodio.vue'
// composables
import { useAppDialog, useAppToast, useAppGlobalProperties } from '@/modules/common/composables'
import { useItemsMenuSuperiorCadena, useLevantamientoCadenaCustodio, useVerCadenaCustodia } from '../../composables'

// utils
import { requestUtil } from '@/utils'

const router = useRouter()
const { launchDialog } = useAppDialog()
const { toastWarning } = useAppToast()
const toggleObservaciones = ref(false)
const toggleEvidencia = ref(false)
const toggleEslabones = ref(false)

const formData = reactive({
  nue: null,
  nueEncontrado: '',
  fechalevantamiento: '',
  observacionCadenaCustodia: '',
  idOrganismo: ''
})

const { levantamientoCadena_getNue } = useLevantamientoCadenaCustodio()

const {
  verCadenaCustodio_getDataCadenaCustodia,
  cadenaCustodio_getEslabonesCadenaCustodia,
  cadenaCustodio_agregarObservacion,
  cadenaCustodio_getObservacionesCadenaCustodia,
  cadena,
  observaciones,
  evidencias
} = useVerCadenaCustodia()

const { itemsMenuSuperior } = useItemsMenuSuperiorCadena(actualizar, exportar)
const { $userName } = useAppGlobalProperties()
function handleBackStep () {
  router.push({ name: 'BandejaCustodio' })
}
function actualizar () {
  console.log('actualizar')
}

function exportar () {
  console.log('exportar')
}
function getObservaciones () {
  const idCadenaCustodia = cadena.value.rotuloCadenaCustodia.idCadenaCustodia
  requestUtil({
    action: cadenaCustodio_getObservacionesCadenaCustodia,
    payload: {
      idCadenaCustodia
    }
  })
}
function getEslabones () {
  const idCadenaCustodia = cadena.value.rotuloCadenaCustodia.idCadenaCustodia
  requestUtil({
    action: cadenaCustodio_getEslabonesCadenaCustodia,
    payload: {
      idCadenaCustodia
    }
  })
}

const nueLoader = ref(false)

function busquedaNue (nue) {
  nueLoader.value = true
  requestUtil({
    action: levantamientoCadena_getNue,
    payload: { nue },
    resolve: ({ estadoNue, idOrganismo }) => {
      if (estadoNue === 'nue_no_existe') {
        nueNoencontrado(estadoNue)
      } else {
        requestUtil({
          action: verCadenaCustodio_getDataCadenaCustodia,
          payload: {
            nue
          },
          resolve: () => {
            formData.nueEncontrado = true
            nueLoader.value = false
            formData.fechalevantamiento = new Date()
            formData.idOrganismo = idOrganismo
            getObservaciones()
            getEslabones()
          },
          reject: (_e) => {
            formData.nueEncontrado = false
            toastWarning('Nue no asignada')
          }
        })
      }
    },
    reject: (err) => {
      console.error(err)
    }
  })
}

function ingresarObservacion () {
  const { observacionCadenaCustodia } = formData
  console.log('la cadena', cadena.value)
  const idCadenaCustodia = cadena.value.rotuloCadenaCustodia.idCadenaCustodia
  if (formData.observacionCadenaCustodia !== '') {
    launchDialog({
      component: ModalIngresarObservacion,
      header: 'Ingresar Observación',
      width: '28%',
      confirmLabel: 'Aceptar',
      accept: () => {
        requestUtil({
          action: cadenaCustodio_agregarObservacion,
          payload: {
            idCadenaCustodia,
            observacion: observacionCadenaCustodia,
            creadoPor: $userName.value
          },
          resolve: () => {
            formData.observacionCadenaCustodia = ''
            getObservaciones()
          },
          reject: (e) => {
            console.error(e)
          }
        })
      }

    })
  } else {
    toastWarning('Debe ingresar al menos un carácter')
  }
}

function nueNoencontrado (respuestaBack) {
  launchDialog({
    component: ModalNueNoAsignadoOEnUso,
    header: 'NUE en uso o no asignado',
    width: '28%',
    confirmLabel: 'Aceptar'
  })
}

</script>
<style scoped>
.buttonSearch {
  height: 2.5em;
  border-radius: 0 5px 5px 0px;
}
</style>
