<template>
<PageHeader
  class="mb-5"
  :items-menu-superior="itemsMenuSuperior"
  page-title="Agregar Eslabón"
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
  class="pb-7"
>
  <Rotulo />
  <AppFieldset
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
    :value="eslabones"
  />
  <TablaObservacionesCadenaCustodio
    :collapsed="!toggleObservaciones"
    :toggleable="true"
    :value="observaciones"
  />

  <IngresarNuevoEslabon
    ref="ingresoNuevoEslabon"
    :ultimo-eslabon="ultimoEslabon"
  />
</section>
<AppFooterBtns
  :button-next-disabled="!formData.nueEncontrado"
  label="Ingresar Nuevo Eslabón"
  @back-step="handleBackStep"
  @next-step="openModalIngresarNuevoEslabon"
/>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

// utils
import { requestUtil, dateTimeUtil } from '@/utils'

// components
import Nue from '@/modules/recepcion-especies-dinero/components/global/Nue.vue'
import Rotulo from '@/modules/recepcion-especies-dinero/components/global/Rotulo.vue'
import PageHeader from '@/modules/common/components/PageHeader.vue'
import AppFooterBtns from '@/modules/global/components/utilities/AppFooterBtns.vue'
import TablaEvidencias from '../../components/levantar-cadena-custodia/TablaEvidencias.vue'
import ModalNueNoAsignada from '@/modules/recepcion-especies-dinero/components/agregar-eslabon/modals/ModalNueNoAsignada.vue'
import IngresarNuevoEslabon from '../../components/agregar-eslabon/IngresarNuevoEslabon.vue'
import EslabonesDeCadenaCustodia from '../../components/ver-cadena-custodia/EslabonesDeCadenaCustodia.vue'
import TablaObservacionesCadenaCustodio from '@/modules/recepcion-especies-dinero/components/ver-cadena-custodia/TablaObservacionesCadenaCustodio.vue'
// composables
import {
  useAppToast,
  useAppDialog,
  useConfirmDialog
} from '@/modules/common/composables'

import {
  useAgregarEslabon,
  useVerCadenaCustodia,
  useItemsMenuSuperiorCadena,
  useLevantamientoCadenaCustodio
} from '@/modules/recepcion-especies-dinero/composables'

const { launchConfirmDialog } = useConfirmDialog()
const { launchDialog } = useAppDialog()
const { toastSuccess, toastWarning, TOAST_MESSAGES, toastError } =
  useAppToast()

const { levantamientoCadena_getNue } = useLevantamientoCadenaCustodio()
const { agregarEslabon_addAgregarEslabon } = useAgregarEslabon()
const {
  verCadenaCustodio_getDataCadenaCustodia,
  cadenaCustodio_getEslabonesCadenaCustodia,
  evidencias,
  eslabones,
  observaciones,
  cadena
} = useVerCadenaCustodia()

const ultimoEslabon = computed(() => {
  let fecha = ''
  let ue = {}
  eslabones.value?.forEach(e => {
    if (e.fechaHora > fecha) {
      ue = e
      fecha = e.fechaHora
    }
  })
  return ue
})

const { itemsMenuSuperior } = useItemsMenuSuperiorCadena(actualizar, exportar)

const ingresoNuevoEslabon = ref()
const toggleObservaciones = ref(false)
const toggleEvidencia = ref(false)
const toggleEslabones = ref(false)

const formData = reactive({
  nueBuscar: null,
  nueEncontrado: null
})

const router = useRouter()

function handleBackStep () {
  router.push({ name: 'BandejaCustodio' })
}
function actualizar () {
  console.log('actualizar')
}

function exportar () {
  console.log('exportar')
}
function getEslabones () {
  requestUtil({
    action: cadenaCustodio_getEslabonesCadenaCustodia,
    payload: {
      idCadenaCustodia: cadena.value.rotuloCadenaCustodia.idCadenaCustodia
    }
  })
}

function openModalIngresarNuevoEslabon () {
  const { isFormValid, formData, resetFormData } = ingresoNuevoEslabon.value

  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  const {
    motivoEntrega,
    observacionesDelEslabon,
    nombre,
    rutQuienRecibe,
    gradoQuienRecibe,
    institucionQuienRecibe,
    unidadQuienRecibe
  } = formData

  launchConfirmDialog({
    message: '¿Está seguro de Ingresar Nuevo Eslabón?',
    header: 'Ingresar Nuevo Eslabón',
    width: '40%',
    accept: () => {
      // agregar action para enviar la solicitud al administrador
      const payload = [
        {
          idCadenaCustodia: cadena.value.rotuloCadenaCustodia.idCadenaCustodia,
          numero: 1,
          fechaHora: dateTimeUtil.formatToBackendWithTime(),
          motivo: motivoEntrega,
          imagenes: ingresoNuevoEslabon.value.imagenAgregar,
          observaciones: observacionesDelEslabon,
          intervinientesCadena: [
            {
              rol: 'Entrega',
              nombre: 'Juan Pérez',
              rut: '21.228.130-1',
              cargo: 'Detective',
              institucion: 'PDI',
              unidad: 'Robos y Focos Criminales',
              id: '1234-asdf'
            },
            {
              rol: 'Recibe',
              nombre: nombre,
              rut: rutQuienRecibe,
              cargo: gradoQuienRecibe,
              institucion: institucionQuienRecibe,
              unidad: unidadQuienRecibe,
              id: 'qwer-65352'
            }
          ]
        }
      ]

      requestUtil({
        action: agregarEslabon_addAgregarEslabon,
        payload,
        resolve: () => {
          getEslabones()
          toastSuccess('Eslabón agegado exitosamente!')
          resetFormData()
        }
      })
    }
  })
}

const nueLoader = ref(false)

function busquedaNue (nue) {
  nueLoader.value = true
  requestUtil({
    action: levantamientoCadena_getNue,
    payload: {
      nue
    },
    resolve: ({ estadoNue }) => {
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
          },
          reject: (_e) => {
            formData.nueEncontrado = false
            toastWarning('Nue sin levantamiento de cadena')
          }
        })
      }
    }
  })
}
function nueNoencontrado (respuestaBack) {
  console.log('No se encontro causa asociada')
  launchDialog({
    component: ModalNueNoAsignada,
    header: 'NUE no asignada',
    props: {
      respuestaBack
    },
    width: '28%',
    cancelLabel: 'Cerrar'
  })
}
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
