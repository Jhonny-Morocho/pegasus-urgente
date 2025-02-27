<template>
<AppFieldset legend="Asignar Ubicación">
  <SeleccionarReubicacionCausaAgrupada
    ref="dataForm"
    :data="especiesIncautadas"
    :data-qr="generarQR"
    :es-reubicacion="esReubicacion"
    :mas-data="dataFijacionFotografica"
    :seleccion-casillero="seleccionCasillero"
    :seleccionar-ubicacion="form"
    :ubicacion-registrada="ubicacionRegistrada"
    @generar-etiqueta="nextStep"
  />
</AppFieldset>
<div class="flex justify-content-end mb-3">
  <Button
    :disabled="!ubicacionRegistrada"
    label="Guardar Ubicación"
    @click="guardarUbicacion"
  />
</div>
<AppFieldset legend="Historial de Ubicación">
  <div class="grid col-12">
    <div class="col-12 lg:col-6 lg:ml-2">
      <h3>RUC Causa Actual: {{ rucCausaActual }}</h3>
    </div>
  </div>
  <TablaHistorialUbicacion
    ref="datosTabla"
    :disponibilidades="disponibilidades"
    @seleccionar-ubicacion="rellenarFormulario"
    @ver-rues="verRues"
  />
</AppFieldset>
</template>

<script setup>
import { defineEmits, defineProps, computed, ref } from 'vue'
import TablaHistorialUbicacion from '@/modules/recepcion-especies-dinero/components/asignar-ubicacion/TablaHistorialUbicacion.vue'
import { requestUtil } from '@/utils'

import {
  useEspecieIncautadaPendienteRecepcionStore,
  useIngresoDinero
} from '@/modules/recepcion-especies-dinero/composables/'
import SeleccionarReubicacionCausaAgrupada from '@/modules/recepcion-especies-dinero/components/decidir-reubicacion/SeleccionarReubicacionCausaAgrupada.vue'
import { useAppDialog, useAppToast } from '@/modules/common/composables'
import ModalRuesByIdCasillero from '@/modules/recepcion-especies-dinero/components/asignar-ubicacion/modales/ModalRuesByIdCasillero.vue'

const emit = defineEmits(['next-step'])

const {
  stepIngresoDinero_darUbicacion,
  dataFijacionFotografica,
  stepIngresoDinero_getRuesByIdCasillero,
  stepIngresoDinero_getUbicacionByRuc
} = useIngresoDinero()

defineProps({
  readOnly: Boolean
})
const { especiesIncautadas } = useEspecieIncautadaPendienteRecepcionStore()
const { toastSuccess, toastError } = useAppToast()
const ubicacionRegistrada = ref(true)
const seleccionCasillero = ref(false)
const datosTabla = ref()

function nextStep () {
  emit('next-step', 'generar-etiqueta-ingreso')
}

const dataForm = ref()
const form = ref()
const esReubicacion = ref(false)

const rucCausaActual = computed(() => especiesIncautadas.value.ruc)

function estalleno (id) {
  return dataForm.value.casilleros.find(c => c.idCasillero === id).tieneEspacio
}

function guardarUbicacion () {
  if (estalleno(dataForm.value.form.casillero)) {
    requestUtil({
      action: stepIngresoDinero_darUbicacion,
      payload: {
        idEspecie: especiesIncautadas.value.idEspecie,
        idCasillero: dataForm.value.form.casillero
      },
      resolve: (res) => {
        toastSuccess('Ubicación agregada con exito')
        ubicacionRegistrada.value = false
        getUbicaciones()
      }
    })
  } else {
    toastError('Casillero seleccionado lleno, seleccione otro por favor')
  }
}

const { launchDialog } = useAppDialog()

function verRues (data) {
  requestUtil({
    action: stepIngresoDinero_getRuesByIdCasillero,
    payload: { id: data.idCasillero },
    resolve: (res) => {
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

function rellenarFormulario (data) {
  form.value = data
  seleccionCasillero.value = true
}

const disponibilidades = ref()

function getUbicaciones () {
  requestUtil({
    action: stepIngresoDinero_getUbicacionByRuc,
    payload: { ruc: rucCausaActual.value },
    resolve: (res) => {
      disponibilidades.value = res.disponibilidades
    }
  })
}
getUbicaciones()
</script>
