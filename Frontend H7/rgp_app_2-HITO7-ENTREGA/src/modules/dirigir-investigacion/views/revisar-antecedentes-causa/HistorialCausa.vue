<template>
<div class="p-fluid">
  <AppFieldset
    collapsed
    legend="Ingreso"
    :toggleable="true"
  >
    <TablaHistorial :value="historialIngreso" />
  </AppFieldset>

  <AppFieldset
    collapsed
    legend="Preclasificación"
    :toggleable="true"
  >
    <TablaHistorial :value="historialPreclasificacion" />
  </AppFieldset>

  <AppFieldset
    collapsed
    legend="Asignación"
    :toggleable="true"
  >
    <TablaHistorial :value="historialAsignacion" />
  </AppFieldset>

  <AppFieldset
    collapsed
    legend="Dirigir la Investigación"
    :toggleable="true"
  >
    <TablaHistorial :value="historialDirigirInvestigacion" />
  </AppFieldset>

  <AppFieldset
    class="pb-0"
    legend="Anotaciones"
    :toggleable="true"
  >
    <TablaAnotaciones
      v-model:first="anotacionesFirst"
      :loading="isLoadingAnotacion"
      :rows="paginacion?.tamanoPagina"
      :total-records="paginacion?.elementosTotales"
      :value="anotaciones"
      @page="getAnotaciones"
    />
    <section class="mt-4 col-12 grid">
      <div class="col-9 m-0">
        <AppInput
          id="input-anotacion"
          v-model="detalleAnotacion"
          label="Anotación"
        />
      </div>
      <div class="col-3 m-0">
        <Button
          class="btn-form"
          :disabled="!detalleAnotacion"
          icon="pi pi-save"
          icon-pos="right"
          label="Agregar Anotación"
          @click="agregarAnotacion"
        />
      </div>
    </section>
  </AppFieldset>
</div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { dateTimeUtil, requestUtil } from '@/utils'
import { useAppGlobalProperties, useAppToast } from '@/modules/common/composables'
import { useAnotacionCausaStore, useHistorialCausaStore } from '@/modules/global/composables'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import TablaAnotaciones from '@/modules/global/components/historial-causa/TablaAnotaciones.vue'
import TablaHistorial from '@/modules/global/components/historial-causa/TablaHistorial.vue'

// eslint-disable-next-line no-unused-vars
const { toastSuccess } = useAppToast()

const { $userName, $userRoles } = useAppGlobalProperties()

const {
  historialIngreso,
  historialPreclasificacion,
  historialAsignacion
} = useHistorialCausaStore()

const {
  paginacion,
  anotaciones,
  anotacionCausa_getAnotacionesByIdDenuncia,
  anotacionCausa_crearAnotacion,
  historialDirigirInvestigacion
} = useAnotacionCausaStore()

const { idDenuncia } = useDirigirInvestigacionStore()

const detalleAnotacion = ref('')
const isLoadingAnotacion = ref(false)
const anotacionesFirst = ref(0)

function agregarAnotacion () {
  const rolUsuario = $userRoles.value.find(el => el.includes('jefe')) ? 'Fiscal Jefe' : 'Fiscal'

  requestUtil({
    action: anotacionCausa_crearAnotacion,
    payload: {
      anotacion: {
        denunciaId: idDenuncia.value,
        anotacion: detalleAnotacion.value,
        autor: $userName.value,
        rol: rolUsuario,
        etapa: 'Dirigir Investigación',
        fechaCreacion: dateTimeUtil.formatToBackendWithTime(new Date())
      }
    },
    resolve: () => {
      toastSuccess('Anotación agregada')
      detalleAnotacion.value = ''
      getAnotaciones()
    }
  })
}

function getHistorialCausa () {
// CUANDO EXISTA EL ENDPOINT
}

function getAnotaciones (pagination = undefined) {
  if (!pagination) {
    anotacionesFirst.value = 0
  }

  requestUtil({
    action: anotacionCausa_getAnotacionesByIdDenuncia,
    payload: {
      idDenuncia: idDenuncia.value,
      params: {
        page: paginacion?.page || 0,
        size: pagination?.rows || 10
      }
    },
    loader: (value) => { isLoadingAnotacion.value = value }
  })
}

onMounted(() => {
  getHistorialCausa()
  getAnotaciones()
})
</script>
