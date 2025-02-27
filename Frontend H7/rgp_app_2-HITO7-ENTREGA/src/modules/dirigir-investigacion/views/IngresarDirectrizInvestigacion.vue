<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
  />

  <section>
    <h1 class="header_d">
      {{ esIngreso ? 'Ingresar ' : 'Actualizar ' }} Directriz de Investigación
    </h1>
    <p class="my-4">
      <strong>RUC:</strong> {{ ruc }}
    </p>
    <p class="my-4">
      <strong>Nombre Causa:</strong> {{ resumenCausa?.nombreCausa }}
    </p>
    <p
      v-if="!esIngreso"
      class="my-4"
    >
      <span v-if="!isLoadingTextDirectriz && directrizGeneral">
        <strong>Fecha/Hora Última Actalización:</strong> {{ mensajeDeIngreso }}
      </span>
    </p>
    <div class="grid p-fluid">
      <AppTextarea
        id="directriz-investigacion"
        v-model="directrizInvestigacion"
        class="col-12"
        :disabled="isLoadingTextDirectriz"
        label="Ingresar Directriz de Investigación de Causa"
        rows="5"
      />
    </div>
  </section>

  <ListaRelaciones
    v-model:relaciones-seleccionadas="relacionesSeleccionadas"
    :es-ingreso="esIngreso"
  />

  <HistorialDirectricesRelaciones
    v-if="existeHistorial"
    :directrices="directricesRelaciones"
    :es-ingreso="esIngreso"
    :loading="isLoadingDRelacion"
    :rows="paginacionDRelacion?.tamanoPagina"
    :total-records="paginacionDRelacion?.elementosTotales"
    @page="getHistorialDirectrizRelacion"
  />

  <HistorialDirectricesCausa
    v-if="existeHistorial"
    :directrices="directricesCausa"
    :es-ingreso="esIngreso"
    :loading="isLoadingDCausa"
    :rows="paginacionDCausa?.tamanoPagina"
    :total-records="paginacionDCausa?.elementosTotales"
    @page="getHistorialDirectrizCausa"
  />

  <div class="mb-6" />

  <AppBtnsSteps
    class=""
    @back-step="handleBackStep"
  />

  <AppBtnRightTeleported>
    <Button
      class="btn-aprobar px-5"
      :disabled="hasDirectrizObligatoria"
      icon="pi pi-sign-out"
      icon-pos="right"
      label="Salir sin Guardar"
      :loading="isLoadingBtnGuardarDirectriz"
      @click="handleSalirSinGuardar"
    />
  </AppBtnRightTeleported>

  <AppBtnNextTeleported
    class="ml-8 px-5"
    :disabled="!existeDirectriz"
    icon="pi pi-save"
    icon-pos="right"
    label="Guardar Directriz"
    :loading="isLoadingBtnGuardarDirectriz"
    @click="handleGuardar"
  />
</section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { requestUtil, dateTimeUtil, appUtil } from '@/utils'
import { useConfirmDialog, useAppToast } from '@/modules/common/composables'
import { usePamStore } from '@/modules/global/composables'
import { useDirigirInvestigacionStore, useMenuSuperiorSecundario } from '@/modules/dirigir-investigacion/composables'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'
import ListaRelaciones from '@/modules/dirigir-investigacion/components/ingresar-directriz-investigacion/ListaRelaciones.vue'
import HistorialDirectricesRelaciones from '@/modules/dirigir-investigacion/components/ingresar-directriz-investigacion/HistorialDirectricesRelaciones.vue'
import HistorialDirectricesCausa from '@/modules/dirigir-investigacion/components/ingresar-directriz-investigacion/HistorialDirectricesCausa.vue'

const { launchConfirmDialog } = useConfirmDialog()
const { toastSuccess, toastWarning } = useAppToast()

const router = useRouter()
const route = useRoute()

const {
  dirigirInvestigacion_completarIngresarDirectrizInvestigacion,
  dirigirInvestigacion_completarActualizarDirectrizInvestigacion,
  dirigirInvestigacion_postGuardarDirectrizInvestigacion,
  dirigirInvestigacion_getObtenerHistorialDirectrizCausa,
  dirigirInvestigacion_getObtenerDirectrizInvestigacion,
  dirigirInvestigacion_getObtenerHistorialDirectrizRelacion,
  dirigirInvestigacion_iniciarYReservar,
  dirigirInvestigacion_SET_DIRECTRIZ_OBLIGATORIA,
  resumenCausa,
  causa,
  ruc,
  hasDirectrizObligatoria
} = useDirigirInvestigacionStore()

const { procesoPam } = usePamStore()

const { itemsMenuSuperior } = useMenuSuperiorSecundario({
  ruc: ruc.value
})

const esIngreso = ref(true) // to-do: debiera venir de la causa
const existeHistorial = computed(() => { return !esIngreso.value })

const directrizInvestigacion = ref('')
const isLoadingBtnGuardarDirectriz = ref(false)
const isLoadingTextDirectriz = ref(false)

const relacionesSeleccionadas = ref([])

const existeDirectriz = computed(() => {
  return directrizInvestigacion.value?.trim()
})

const mensajeDeIngreso = computed(() => {
  const mensajeUltimaActualizacion = `${formatDate(directrizGeneral.value.fechaUltimaModificacion)}`

  return mensajeUltimaActualizacion
})

onMounted(async () => {
  // si la ruta es actualizar directriz de investigación
  if (route.name === 'DIActualizarDirectrizInvestigacion') {
    esIngreso.value = false
  } else {
    esIngreso.value = true
  }

  if (esIngreso.value === false) {
    obtenerDatosActualizadosDirectriz()
  }
})

const directrizGeneral = ref(null)
const directricesCausa = ref([])
const directricesRelaciones = ref([])

const isLoadingDCausa = ref(false)
const isLoadingDRelacion = ref(false)

async function obtenerDatosActualizadosDirectriz () {
  requestUtil({
    action: dirigirInvestigacion_getObtenerDirectrizInvestigacion,
    payload: {
      idCausa: causa.value?.data?.causa?.idCausa
    },
    resolve: (_data) => {
      if (_data) {
        directrizGeneral.value = _data
        directrizInvestigacion.value = _data?.descripcionDirectriz
      }
    },
    loader: (l) => { isLoadingTextDirectriz.value = l }
  })
  getHistorialDirectrizCausa()
  getHistorialDirectrizRelacion()
}

const paginacionDCausa = ref({})
const paginacionDRelacion = ref({})
async function getHistorialDirectrizCausa (pagination = undefined) {
  requestUtil({
    action: dirigirInvestigacion_getObtenerHistorialDirectrizCausa,
    payload: {
      idCausa: causa.value?.data?.causa?.idCausa,
      params: {
        page: pagination?.page || 0,
        size: pagination?.rows || 5
      }
    },
    resolve: (_data) => {
      directricesCausa.value = _data?.data
      paginacionDCausa.value = _data?.paginacion
    },
    loader: (l) => (isLoadingDCausa.value = l)
  })
}
async function getHistorialDirectrizRelacion (pagination = undefined) {
  requestUtil({
    action: dirigirInvestigacion_getObtenerHistorialDirectrizRelacion,
    payload: {
      idCausa: causa.value?.data?.causa?.idCausa,
      params: {
        page: pagination?.page || 0,
        size: pagination?.rows || 5
      }
    },
    resolve: (_data) => {
      directricesRelaciones.value = _data?.data
      paginacionDRelacion.value = _data?.paginacion
    },
    loader: (l) => (isLoadingDRelacion.value = l)
  })
}

function formatDate (value) {
  let fechaCreacion = value

  fechaCreacion = dateTimeUtil.addNMinutes(fechaCreacion, -180)

  return fechaCreacion
}

function handleGuardar () {
  const relaciones = relacionesSeleccionadas.value.map(relacion => {
    return {
      idRelacionDelito: relacion.idRelacionDelito,
      directriz: relacion.descripcionDirectriz || ''
    }
  })

  const payload = {
    idCausa: causa.value?.data?.causa?.idCausa,
    directrizCausa: directrizInvestigacion.value,
    directricesRelaciones: relaciones
  }

  launchConfirmDialog({
    header: 'Guardar Directriz de Investigación',
    message: '¿Desea guardar Directriz de Investigación?',
    acceptLabel: 'Aceptar',
    accept: async () => {
      requestUtil({
        // llamar para todos los casos (si es ingreso o no) el POST
        action: dirigirInvestigacion_postGuardarDirectrizInvestigacion,
        payload: payload,
        resolve: () => {
          dirigirInvestigacion_SET_DIRECTRIZ_OBLIGATORIA(false)
          completarIngresarDirectriz()
        },
        loader: (l) => { isLoadingBtnGuardarDirectriz.value = l },
        reject: (err) => (console.log('err', err))
      })
    }
  })
}

const flagSinGuardar = ref(false)
function handleSalirSinGuardar () {
  launchConfirmDialog({
    header: 'Salir Sin Guardar',
    message: '¿Está seguro de salir sin guardar la Directriz de Investigación?',
    acceptLabel: 'Aceptar',
    accept: () => {
      flagSinGuardar.value = true
      completarIngresarDirectriz()
    }
  })
}

async function completarIngresarDirectriz () {
  let actionCompletar = dirigirInvestigacion_completarIngresarDirectrizInvestigacion

  // Logica para controlar flujos pam por frontend
  if (
    procesoPam.value?.taskName === 'Analizar Antecedentes de la Causa y Decidir Acciones Investigativas' ||
    procesoPam.value?.taskName === 'Analizar Antecedentes de la Causa y Decidir Acciones' ||
    appUtil.includeWord(procesoPam.value?.taskName, 'Actualizar Directriz')
  ) {
    actionCompletar = dirigirInvestigacion_completarActualizarDirectrizInvestigacion
  }

  await requestUtil({
    action: actionCompletar,
    payload: {
      ...procesoPam.value
    },
    resolve: () => {
      iniciarYReservarTarea({
        resolve: () => {
          router.push({ name: 'DIDesarrolloInvestigacion' })
        }
      })

      if (flagSinGuardar.value) {
        toastWarning('Se decidio no guardar una Directriz de Investigación')
        return
      }

      if (appUtil.includeWord(router.currentRoute.value.fullPath, 'actualizar')) {
        toastSuccess('Se actualizo correctamente la Directriz de Investigación')
      } else {
        toastSuccess('Se ingreso correctamente una Directriz de Investigación')
      }
    },
    loader: (l) => { isLoadingBtnGuardarDirectriz.value = l }
  })
}

function iniciarYReservarTarea ({ resolve }) {
  requestUtil({
    action: dirigirInvestigacion_iniciarYReservar,
    payload: {
      ...procesoPam.value
    },
    resolve,
    reject: (err) => {
      console.error(err)
    }
  })
}

function handleBackStep () {
  router.go(-1)
}

</script>

<style lang="scss" scoped>
.btn-aprobar {
  background-color: $primary-color;
  transition: all 0.5s ease;
  &:hover{
    background-color: $primary-color-hover !important;
  }
}

.header_d {
  margin-top: -20px;
}
</style>
