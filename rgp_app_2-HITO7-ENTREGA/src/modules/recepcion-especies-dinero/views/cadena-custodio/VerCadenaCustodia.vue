<template>
<PageHeader
  class="mb-5"
  :items-menu-superior="itemsMenuSuperior"
  page-title="Consultar Cadena Custodia"
/>
<AppFieldset legend="Búsqueda por NUE">
  <div class="p-fluid w-full">
    <Nue
      class="col-12 md:col-4 mb-4"
      :label="'Ingrese NUE'"
      :loading="nueLoader"
      :nue="nue"
      @buscar-nue="busquedaNue"
    />
  </div>
</AppFieldset>
<Rotulo v-if="formData.nueEncontrado" />
<AppFieldset
  v-if="formData.nueEncontrado"
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
  v-if="formData.nueEncontrado"
  :collapsed="!toggleEslabones"
  :toggleable="true"
  :value="eslabones"
/>
<TablaObservacionesCadenaCustodio
  v-if="formData.nueEncontrado"
  :collapsed="!toggleObservaciones"
  :toggleable="true"
  :value="observaciones"
/>

<AppFooterBtns
  no-button-next
  @back-step="handleBackStep"
/>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { reactive, defineExpose, ref } from 'vue'

// componentes
import Rotulo from '@/modules/recepcion-especies-dinero/components/global/Rotulo.vue'
import TablaEvidencias from '../../components/levantar-cadena-custodia/TablaEvidencias.vue'
import EslabonesDeCadenaCustodia from '../../components/ver-cadena-custodia/EslabonesDeCadenaCustodia.vue'
import ModalNueNoAsignada from '../../components/ver-cadena-custodia/modals/ModalNueNoAsignada'
import AppFooterBtns from '@/modules/global/components/utilities/AppFooterBtns.vue'
import Nue from '@/modules/recepcion-especies-dinero/components/global/Nue.vue'
import TablaObservacionesCadenaCustodio from '@/modules/recepcion-especies-dinero/components/ver-cadena-custodia/TablaObservacionesCadenaCustodio.vue'
// composables
import { useAppDialog, useAppToast } from '@/modules/common/composables'
import { useItemsMenuSuperiorCadena, useLevantamientoCadenaCustodio, useVerCadenaCustodia } from '@/modules/recepcion-especies-dinero/composables/'

// utils
import { requestUtil } from '@/utils'

const { launchDialog } = useAppDialog()
const { toastWarning } = useAppToast()
const { levantamientoCadena_getNue } = useLevantamientoCadenaCustodio()
const { itemsMenuSuperior } = useItemsMenuSuperiorCadena(actualizar, exportar)
const { verCadenaCustodio_getDataCadenaCustodia, cadenaCustodio_getObservacionesCadenaCustodia, cadenaCustodio_getEslabonesCadenaCustodia, evidencias, eslabones, observaciones, cadena } = useVerCadenaCustodia()

const router = useRouter()
const toggleEvidencia = ref(false)
const toggleEslabones = ref(false)
const toggleObservaciones = ref(false)

const formData = reactive({
  nueBuscar: null,
  nueEncontrado: null
})

function actualizar () {
  console.log('actualizar')
}

function exportar () {
  console.log('exportar')
}
function handleBackStep () {
  router.push({ name: 'BandejaCustodio' })
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
    payload: {
      nue: nue
    },
    resolve: ({ estadoNue }) => {
      if (estadoNue === 'nue_no_existe') {
        nueNoencontrado(estadoNue)
      } else {
        requestUtil({
          action: verCadenaCustodio_getDataCadenaCustodia,
          payload: {
            nue: nue
          },
          resolve: () => {
            formData.nueEncontrado = true
            nueLoader.value = false
            getObservaciones()
            getEslabones()
          },
          reject: (_e) => {
            formData.nueEncontrado = false
            toastWarning('Nue sin levantamiento de cadena')
          }
        })
      }
    },
    reject: (err) => {
      console.log(err)
    }
  })
}

function nueNoencontrado (respuestaBack) {
  console.log('No se encontro causa asociada')
  launchDialog({
    component: ModalNueNoAsignada,
    // (condicional del header) buscar un dato en la respuesta de back para hacer la validacion de si el nue no es valido o no se encontro ruc asociado a este
    header: 'NUE no asignada',
    props: {
      respuestaBack
    },
    width: '28%',
    cancelLabel: 'Cerrar'
  })
}

defineExpose({ formData })
</script>
<style scoped>
.buttonSearch {
  height: 2.5em;
  border-radius: 0 5px 5px 0px;
}
.colorNue {
  color: red;
}
</style>
