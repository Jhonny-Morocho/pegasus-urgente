<template>
<section>
  <hr>
  <AppFieldset
    class="mt-5"
    legend="Anotaciones"
    no-margin-bottom
  >
    <TablaAnotaciones
      :loading="isLoading"
      :rows="paginacion?.tamanoPagina"
      :total-records="paginacion?.elementosTotales"
      :value="anotaciones"
      @page="getAnotaciones"
    />
    <section class="mt-4 col-12 grid p-fluid">
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
          :loading="isLoadingAnotaciones"
          @click="agregarAnotacion"
        />
      </div>
    </section>
  </AppFieldset>
</section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { requestUtil } from '@/utils'
import { useAnotacionCausaStore } from '@/modules/global/composables'
import { useAppGlobalProperties, useAppToast } from '@/modules/common/composables'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import TablaAnotaciones from '@/modules/global/components/historial-causa/TablaAnotaciones.vue'

const { toastSuccess } = useAppToast()
const { $userName, $userRoles } = useAppGlobalProperties()

const {
  anotaciones,
  paginacion,
  anotacionCausa_crearAnotacion,
  anotacionCausa_getAnotacionesByIdDenuncia
} = useAnotacionCausaStore()
const {
  idDenuncia
} = useDirigirInvestigacionStore()

const isLoading = ref(false)
const isLoadingAnotaciones = ref(false)
const anotacionesFirst = ref(0)
const detalleAnotacion = ref('')

async function agregarAnotacion () {
  const rolUsuario = $userRoles.value.find(el => el.includes('jefe')) ? 'Fiscal Jefe' : 'Fiscal'

  const payload = {
    id: 'id',
    denunciaId: idDenuncia.value,
    anotacion: detalleAnotacion.value,
    autor: $userName.value,
    rol: rolUsuario,
    etapa: 'Desarrollo de la Investigación'
  }

  requestUtil({
    action: anotacionCausa_crearAnotacion,
    payload: {
      anotacion: { ...payload }
    },
    resolve: async () => {
      toastSuccess('Anotación Agregada')
      getAnotaciones()
      detalleAnotacion.value = ''
    },
    loader: (l) => { isLoadingAnotaciones.value = l }
  })
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
        page: pagination?.page || 0,
        size: pagination?.rows || 10
      }
    },
    loader: (value) => { isLoading.value = value }
  })
}

onMounted(async () => {
  getAnotaciones()
})
</script>
