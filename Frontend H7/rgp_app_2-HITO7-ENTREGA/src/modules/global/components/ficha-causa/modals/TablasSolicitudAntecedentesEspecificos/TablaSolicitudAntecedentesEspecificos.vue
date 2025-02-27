<template>
<div class="grid">
  <div class="col-12 md:col-4">
    <div
      class="p-inputgroup px-2"
      style="height: 36px; margin-top: 6px"
    >
      <Dropdown
        id="origen"
        v-model="origen"
        option-label="descripcion"
        option-value="idOrigen"
        :options="origenesAntecedentes"
        placeholder="Filtrar por Origen"
      />
      <Button
        class="p-button-info"
        icon="pi pi-times"
        @click="resetDropdownOrigen()"
      />
    </div>
  </div>
  <div class="col-12 md:col-4 md:col-offset-4">
    <div
      class="p-inputgroup px-2"
      style="height: 36px; margin-top: 6px"
    >
      <InputText
        v-model="buscar"
        placeholder="Buscar"
      />
      <Button
        class="btn-primary"
        icon="pi pi-search"
      />
    </div>
  </div>
  <AppDataTable
    id="antecedentes-especificos"
    class="col-12"
    :loading="isLoadingTable"
    :rows="5"
    :value="antecedentesEspecificos"
  >
    <Column header="Antecedentes Disponibles">
      <template #body="slotProps">
        <span>
          {{ slotProps.data.nombreAntecedente }}
        </span>
      </template>
    </Column>
    <Column header="Origen">
      <template #body="slotProps">
        <span>
          {{ slotProps.data.nombreOrigen }}
        </span>
      </template>
    </Column>
    <Column
      header="Acciones"
      style="width: 48px"
    >
      <template #body="slotProps">
        <div class="flex justify-content-center">
          <Button
            class="p-button-rounded p-button-outlined btn-primary-outline"
            icon="pi pi-ellipsis-v"
            @click="btnSolicitarAntecedenteEspecifico(slotProps.data)"
          />
        </div>
      </template>
    </Column>
  </AppDataTable>
</div>
</template>

<script setup>
import { propTypes } from '@/modules/common/types/prop.types'
import { ref, watch, defineProps } from 'vue'
import { requestUtil } from '@/utils'
import { useFichaCausaStore } from '@/modules/global/composables'
import { useAppDialog } from '@/modules/common/composables'
import ModalCompletarSolicitud from '@/modules/global/components/ficha-causa/modals/TablasSolicitudAntecedentesEspecificos/ModalCompletarSolicitud.vue'

defineProps({
  ruc: propTypes.string
})

const { launchDialog } = useAppDialog()

const {
  antecedentesEspecificos,
  origenesAntecedentes,
  fichaCausa_getAntecedentesEspecificos,
  fichaCausa_postSolicitarAntecedentes
} = useFichaCausaStore()

const origen = ref(0)
const buscar = ref('')
const isLoadingTable = ref(false)

requestUtil({
  action: fichaCausa_getAntecedentesEspecificos
})

function resetDropdownOrigen () {
  origen.value = 0
}

const antecedentesFiltrados = ref(antecedentesEspecificos.value)

function filtrarAntecedentesPorOrigen (idOrigen) {
  if (idOrigen === 0) {
    antecedentesFiltrados.value = antecedentesEspecificos.value
  } else {
    const antecedentes = antecedentesEspecificos.value.filter((antecedente) => antecedente.idOrigen === origen.value)
    antecedentesFiltrados.value = antecedentes
  }
}
watch(
  () => origen.value,
  (currentValue) => {
    filtrarAntecedentesPorOrigen(currentValue)
  }
)

function filtrarAntecedentesBuscarAntecedente (descripcion) {
  filtrarAntecedentesPorOrigen(origen.value)
  const antecedentes = antecedentesFiltrados.value.filter((antecedente) =>
    antecedente.descripcion
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .includes(
        descripcion
          .toUpperCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
      )
  )
  antecedentesFiltrados.value = antecedentes
}

function filtrarAntecedentesBuscarOrigen (origenes, descripcion) {
  filtrarAntecedentesBuscarAntecedente(descripcion)
  const antecedentes = antecedentesEspecificos.value.filter((antecedente) => origenes.find((o) => o.idOrigen === antecedente.idOrigen))
  // antecedentesFiltrados.value = antecedentes.concat(antecedentesFiltrados.value)
  antecedentesFiltrados.value = [...new Set([...antecedentes, ...antecedentesFiltrados.value])]
}

function origenesFiltroAntecedentes (descripcion) {
  const origenes = origenesAntecedentes.value.filter((origin) =>
    origin.descripcion
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .includes(
        descripcion
          .toUpperCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
      )
  )
  filtrarAntecedentesBuscarOrigen(origenes, descripcion)
}

function filtrarAntecedentesBuscar (descripcion) {
  if (origen.value === 0) {
    origenesFiltroAntecedentes(descripcion)
  } else {
    filtrarAntecedentesBuscarAntecedente(descripcion)
  }
}
watch(
  () => buscar.value,
  (currentValue) => {
    filtrarAntecedentesBuscar(currentValue)
  }
)
function btnSolicitarAntecedenteEspecifico (dataAntecedente) {
  launchDialog({
    component: ModalCompletarSolicitud,
    header: `Completar Información de la Solicitud:`,
    width: '70%',
    props: { dataAntecedente },
    confirmLabel: 'Completar Solicitud',
    accept: (payload) => {
      requestUtil({
        action: fichaCausa_postSolicitarAntecedentes,
        payload: payload
        // resolve: (response) => {
        //   console.log('postSolicitudAntecedentesResponse: ', response.data)
        // }
      })
    }
  })
}
</script>
