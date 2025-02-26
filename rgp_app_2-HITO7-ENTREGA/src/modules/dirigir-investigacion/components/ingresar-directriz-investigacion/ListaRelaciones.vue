<template>
<section class="mb-8">
  <AppFieldset legend="Lista de Relaciones">
    <AppDataTable
      v-bind="$attrs"
      class="col-12"
      data-key="idRelacionDelito"
      edit-mode="cell"
      :loading="relacionesPagination.isLoading"
      responsive-layout="stack"
      :total-records="relacionesData.length || 0"
      :value="relacionesData"
      @cell-edit-complete="onCellEditComplete"
    >
      <Column
        header="Seleccionar"
        style="width: 74px"
      >
        <template #body="{ data }">
          <div class="flex justify-content-center">
            <input
              :id="data.idRelacionDelito"
              v-model="relacionesSeleccionadas"
              class="p-checkbox"
              type="checkbox"
              :value="data"
              @change="updateRelacionesSeleccionadas"
            >
          </div>
        </template>
      </Column>
      <Column
        field="nombreCompletoVictima"
        header="Victima(s)"
      >
        <template #body="{ data }">
          {{ data?.nombreCompletoVictima || 'N/A' }}
        </template>
      </Column>
      <Column
        field="nombreCompletoImputado"
        header="Imputado(s)"
      >
        <template #body="{ data }">
          {{ data?.nombreCompletoImputado || 'N/A' }}
        </template>
      </Column>
      <Column
        field="delito"
        header="Delito(s)"
      >
        <template #body="{ data }">
          {{ data?.nombreDelito || 'N/A' }}
        </template>
      </Column>
      <Column
        field="estadoRelacion"
        header="Estado Relación"
      >
        <template #body="{ data }">
          {{ data?.estadoRelacionDescripcion || 'N/A' }}
        </template>
      </Column>
      <Column
        v-if="!esIngreso"
        field="fechaRegistroDirectriz"
        header="Fecha de Registro de la Directriz"
      >
        <template #body="{ data }">
          {{ dateTimeUtil.formatToFrontendWithTime(data?.fechaRegistroDirectriz) || '-' }}
        </template>
      </Column>
      <Column
        field="descripcionDirectriz"
        header="Directriz de Investigación en la Relación"
      >
        <template #body="{ data, field }">
          <AppTextarea
            id="directriz-investigacion"
            v-model="data[field]"
            :auto-resize="true"
            autofocus
            class="p-fluid mb-0"
            :disabled="!isSelected(data['idRelacionDelito'])"
            label=""
            rows="5"
          />
        </template>
      </Column>
    </AppDataTable>
  </AppFieldset>
</section>
</template>

<script setup>
import { ref, onMounted, reactive, computed, defineProps, defineEmits } from 'vue'
import { requestUtil, dateTimeUtil } from '@/utils'
import { useRelacionesStore } from '@/modules/global/composables'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'

const relacionesSeleccionadas = ref([])

defineProps({
  esIngreso: Boolean
})

const emit = defineEmits(['update:relacionesSeleccionadas'])

const { idDenuncia } = useDirigirInvestigacionStore()

const { relaciones_getRelacionesCausaUltimaDirectriz } = useRelacionesStore()

const relaciones = ref([])

const relacionesData = computed(() => {
  return relaciones.value.map((r) => {
    return {
      ...r,
      ultimaDirectriz: undefined,
      fechaRegistroDirectriz: r?.ultimaDirectriz?.fechaUltimaModificacion || null,
      descripcionDirectriz: r?.ultimaDirectriz?.descripcionDirectriz || ''
    }
  })
})

const relacionesPagination = reactive({
  isLoading: false,
  isEditando: false,
  firstRecord: 0
})

async function getRelaciones (pagination = undefined) {
  if (!pagination) {
    relacionesPagination.firstRecord = 0
  }

  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  requestUtil({
    action: relaciones_getRelacionesCausaUltimaDirectriz,
    payload: {
      idDenuncia: idDenuncia.value,
      params
    },
    loader: (l) => { relacionesPagination.isLoading = l },
    resolve (data) {
      relaciones.value = data
    }
  })
}

function updateRelacionesSeleccionadas () {
  emit('update:relacionesSeleccionadas', relacionesSeleccionadas.value)
}

function isSelected (id) {
  return relacionesSeleccionadas.value.find((rel) => rel.idRelacionDelito === id)
}

onMounted(async () => {
  getRelaciones()
})

function onCellEditComplete (event) {
  const { newData, index } = event

  // si no se ingreso nada en directriz(textarea), no guardamos nada ni seteamos la fecha
  if (relacionesData.value[index]?.directriz) {
    return
  }

  relacionesData.value[index] = newData
  relacionesData.value[index].fechaRegistroDirectriz = dateTimeUtil.formatToBackendWithTime(new Date())
}
</script>
