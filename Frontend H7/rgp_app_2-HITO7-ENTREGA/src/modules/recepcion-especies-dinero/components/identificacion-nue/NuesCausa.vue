<template>
<div class="col-12 py-0 flex justify-content-end">
  <AppInput
    id="filtro"
    v-model="filtro"
    class="mb-0 mx-1"
    label="Filtrar por NUE"
    @change="filterArrayNues()"
  />
</div>
<DataView
  class="w-full"
  :layout="'list'"
  :paginator="true"
  :rows="5"
  :value="arrayNues"
>
  <template #list="slotProps">
    <div
      class="col-12 p-1 my-1"
      style="border-radius:4px;border-color:#e4e4e4;border-width:1px"
    >
      <div
        class="field-checkbox m-1 p-2"
        style="border-radius: 4px;background-color:#e9ecef;width: fit-content;"
      >
        <div class="flex justify-content-center">
          <input
            :id="nue"
            v-model="nueSeleccionado"
            class="p-checkbox"
            :disabled="slotProps.data.find(e => e.recepcionada === true)"
            type="radio"
            :value="slotProps.data"
          >
        </div>
        <label for="binary"><span class="font-bold">NUE: </span>
          {{ slotProps.data.find(e => e).nue }}
          {{ ((slotProps.data.find(e => e.recepcionada === true))?.recepcionada ? ' - NUE Recepcionado' : '') }}
        </label>
      </div>
      <AppDataTable
        id="tabla-especies-por-nue"
        class="col-12 mb-4 p-datatable-sm"
        no-paginator
        :value="slotProps.data"
      >
        <Column
          header="Familia Especie"
          style="width: 180px"
        >
          <template #body="{ data }">
            <span
              v-if="!loaderF"
            >
              {{ familiaEspecie(data.idFamilia) }}
            </span>
            <ProgressBar
              v-else
              mode="indeterminate"
              style="height: 0.5em"
            />
          </template>
        </Column>
        <Column
          header="Tipo Especie"
          style="width: 150px"
        >
          <template #body="{ data }">
            <span
              v-if="!loaderT"
            >
              {{ tipoEspecie(data.tipo) }}
            </span>
            <ProgressBar
              v-else
              mode="indeterminate"
              style="height: 0.5em"
            />
          </template>
        </Column>
        <Column
          header="Descripción"
          style="width: 150px"
        >
          <template #body="{ data }">
            {{ data.descripcion }}
          </template>
        </Column>
        <Column
          header="Marca"
          style="width: 150px"
        >
          <template #body="{ data }">
            {{ data.especiePeligrosa ? "Especie Peligrosa" : "No Definido" }}
          </template>
        </Column>
        <Column
          header="Monto/Cantidad"
          style="width: 150px"
        >
          <template #body="{ data }">
            {{ getMontoCantidad(data) }}
          </template>
        </Column>
        <Column
          header="Observaciones"
          style="width: 150px"
        >
          <template #body="{ data }">
            {{ data.observacion ?? 'Sin Observación' }}
          </template>
        </Column>
        <Column
          header="Imágenes"
          style="width: 150px"
        >
          <template #body="{data}">
            <i
              v-if="data?.documentos?.find((e) => e.id_filenet) !== undefined"
              class="pi pi-images link"
              style="font-size: 2em"
              @click="openModalImagen(data)"
            />
            <span v-else>Sin Imagen</span>
          </template>
        </Column>
      </AppDataTable>
    </div>
  </template>
</DataView>
</template>
<script setup>
import DataView from 'primevue/dataview'
import { propTypes } from '@/modules/common/types'
import { useMantenedorStore } from '@/modules/global/composables'
import { defineProps, ref, watch, defineEmits, computed } from 'vue'
import { requestUtil } from '@/utils'
import ModalImagenEvidencia from '@/modules/recepcion-especies-dinero/components/ver-cadena-custodia/modals/ModalImagenEvidencia.vue'
import { useAppDialog } from '@/modules/common/composables'
import { useIdentificacionNueStore } from '@/modules/recepcion-especies-dinero/composables'

const {
  mantenedor_getFamiliaEspecies,
  mantenedor_getCodigoFamiliaEspecieById,
  mantenedor_getNombreFamiliaEspecie,
  mantenedor_getNombreTipoEspecie,
  mantenedor_getAllTiposEspecie
} = useMantenedorStore()

const dP = defineProps({
  dataEspecies: propTypes.object,
  nueSeleccionado: propTypes.object
})

const arrayNues = computed(() => filterArrayNues())

const filtro = ref('')

function filterArrayNues () {
  const array = Object.values(dP.dataEspecies)
  if (filtro.value === '') {
    return array
  } else {
    return array.filter(n => n.find(e => e.nue).nue.includes(filtro.value))
  }
}

const { stepIdentificacionNue_obtenerDocumentosByIdEspecie } = useIdentificacionNueStore()

const loaderF = ref(false)

const loaderT = ref(false)

const { launchDialog } = useAppDialog()

function getMontoCantidad (d) {
  if (mantenedor_getCodigoFamiliaEspecieById(d.idFamilia) === '21') {
    return `$ ${d.dinero.find(e => e.monto)?.monto}` ?? 'Sin monto'
  } else {
    return d.cantidadEspecie ?? 'Sin cantidad'
  }
}

function openModalImagen (data) {
  requestUtil({
    action: stepIdentificacionNue_obtenerDocumentosByIdEspecie,
    payload: { idEspecie: data.idEspecie },
    resolve: (data) => {
      console.log('res filent', data)
      launchDialog({
        component: ModalImagenEvidencia,
        header: 'Imágenes',
        width: '80vw',
        heigth: '50vh',
        props: {
          dataDocumento: {
            data
          }
        },
        cancelLabel: 'Cerrar'
      })
    }
  })
}

function cargarMantenedores () {
  loaderF.value = true
  loaderT.value = true
  requestUtil({
    action: mantenedor_getFamiliaEspecies,
    resolve: (r) => {
      loaderF.value = false
    },
    reject: (r) => {
      loaderF.value = false
    }
  })
  requestUtil({
    action: mantenedor_getAllTiposEspecie,
    resolve: (r) => {
      loaderT.value = false
    },
    reject: (r) => {
      loaderT.value = false
    }
  })
}

watch(
  () => dP.dataEspecies,
  () => {
    cargarMantenedores()
  }
)

function familiaEspecie (idFamiliaEspecie) {
  return mantenedor_getNombreFamiliaEspecie(idFamiliaEspecie)
}

function tipoEspecie (idTipoEspecie) {
  return mantenedor_getNombreTipoEspecie(idTipoEspecie)
}

const nueSeleccionado = ref()

const emit = defineEmits(['seleccionar-nue'])

watch(
  () => nueSeleccionado.value,
  () => emit('seleccionar-nue', nueSeleccionado.value)
)
</script>
