<template>
<AppFieldset legend="Seleccionar Reubicación">
  <SeleccionarReubicacionCausaAgrupada
    ref="dataReubicacion"
    :data-reubicacion="dataRue"
    :es-reubicacion="true"
    :seleccionar-ubicacion="form"
    :ubicacion-registrada="ubicacionRegistrada"
    @generar-etiqueta="nextStep"
  />
</AppFieldset>
<div class="flex justify-content-end">
  <Button
    :disabled="!ubicacionRegistrada"
    label="Guardar Ubicación"
    @click="guardarReubicacion"
  />
</div>
<AppFieldset :legend="`Ubicación Causa ${dataRue.dataCausa.causa.rolUnico}`">
  <TablaHistorialUbicacion
    ref="datosTabla"
    :disponibilidades="disponibilidades"
    @seleccionar-ubicacion="rellenarFormulario"
    @ver-rues="verRues"
  />
</AppFieldset>
</template>
<script setup>
import SeleccionarReubicacionCausaAgrupada from '@/modules/recepcion-especies-dinero/components/decidir-reubicacion/SeleccionarReubicacionCausaAgrupada.vue'
import TablaHistorialUbicacion from '@/modules/recepcion-especies-dinero/components/asignar-ubicacion/TablaHistorialUbicacion.vue'
import ModalRuesByIdCasillero from '@/modules/recepcion-especies-dinero/components/asignar-ubicacion/modales/ModalRuesByIdCasillero.vue'

import { ref, defineEmits } from 'vue'
import { requestUtil } from '@/utils'
import { useAppDialog, useAppToast } from '@/modules/common/composables'
import {
  useBandejaCustodioStore,
  useIngresoDinero,
  useStepBusquedaAgregarSepararEspecies
} from '../../composables'

const {
  dataRue,
  stepBusquedaAgregarSepararEspecies_reubicarEspecie,
  stepBusquedaAgregarSepararEspecies_getEtiqueta
} = useStepBusquedaAgregarSepararEspecies()

const {
  stepIngresoDinero_getRuesByIdCasillero,
  stepIngresoDinero_getGenerarEtiqueta,
  stepIngresoDinero_getUbicacionByRuc
} = useIngresoDinero()
const { bandejaCustodio_SET_FLUJO } = useBandejaCustodioStore()

const { toastSuccess } = useAppToast()
const datosTabla = ref()

const emit = defineEmits(['next-step'])

// const ubicaciones = ref()
const disponibilidades = ref()

function getUbicaciones () {
  requestUtil({
    action: stepIngresoDinero_getUbicacionByRuc,
    payload: { ruc: dataRue.value.especie.ruc },
    resolve: (res) => {
      // ubicaciones.value = res.ubicaciones
      disponibilidades.value = res.disponibilidades
    }
  })
}
getUbicaciones()

const dataReubicacion = ref()
const ubicacionRegistrada = ref(true)

function guardarReubicacion () {
  requestUtil({
    action: stepBusquedaAgregarSepararEspecies_reubicarEspecie,
    payload: {
      modificadoPor: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      especies: [
        {
          idEspecieUbicacion: dataRue.value.especie.idEspecieUbicacion,
          idCasillero: dataReubicacion.value.form.casillero,
          idSector: dataReubicacion.value.form.sector,
          idBodega: dataReubicacion.value.form.bodega
        }
      ]
    },
    resolve: (res) => {
      toastSuccess('Ubicación corregida con exito')
      ubicacionRegistrada.value = false
      getUbicaciones()
    }
  })
}

function nextStep () {
  requestUtil({
    action: stepIngresoDinero_getGenerarEtiqueta,
    payload: { rue: dataRue.value.especie.RUE },
    resolve: (res) => {
      emit('next-step', 'generar-etiqueta')
      bandejaCustodio_SET_FLUJO('Reubicar')
      requestUtil({
        action: stepBusquedaAgregarSepararEspecies_getEtiqueta,
        payload: res
      })
    }
  })
}

const { launchDialog } = useAppDialog()

function verRues (data) {
  requestUtil({
    action: stepIngresoDinero_getRuesByIdCasillero,
    payload: { id: data.idCasillero },
    resolve: (res) => {
      console.log('casilleros', res)
      launchDialog({
        component: ModalRuesByIdCasillero,
        header: `RUE's que utilizan el Casillero`,
        props: {
          data: res.data
        },
        cancelLabel: 'Cerrar'
      })
    }
  })
}

const form = ref()

function rellenarFormulario (data) {
  form.value = data
}
</script>
