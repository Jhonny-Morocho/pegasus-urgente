<template>
<AppFieldset
  class="mb-6"
  :disabled=" isDisabled"
  legend="Diligencias Sugeridas"
>
  <AppDataTable
    id="diligenciasSugeridas"
    class="col-12"
    :loading="isLoadingSugeridas"
    :total-records="diligenciasFiltradas.length"
    :value="paginacionTemporal"
    @page="getData"
  >
    <Column header="Código Diligencia">
      <template #body="slotProps">
        {{ mantenedor_getCodigoTipoDiligencia(slotProps.data.idPadre) }}
      </template>
    </Column>
    <Column header="Tipo Diligencia">
      <template #body="slotProps">
        {{
          mantenedor_getNombreTipoDiligencia(
            slotProps.data.idPadre
          )
        }}
      </template>
    </Column>
    <Column header="Subtipo Diligencia">
      <template #body="slotProps">
        {{
          mantenedor_getNombreSubtipoDiligencia(slotProps.data.id)
        }}
      </template>
    </Column>
    <Column header="Acciones">
      <template #body="slotProps">
        <Button
          class="p-button-rounded p-button-warning p-button-outlined mr-2"
          icon="pi pi-paperclip"
          @click="
            abrirModalInstruirDiligenciaSugerida(
              slotProps.data
            )
          "
        />
      </template>
    </Column>
  </AppDataTable>
</AppFieldset>
</template>

<script setup>
import { defineProps, ref, onUpdated } from 'vue'
import { useDialog } from 'primevue/usedialog'

import { useMantenedorStore } from '@/modules/global/composables'
import ModalInstruirDiligenciaSugerida from '@/modules/flagrancia/components/diligencias-e-instrucciones/modales/ModalInstruirDiligencia.vue'
import { propTypes } from '@/modules/common/types'

const dialog = useDialog()

const {
  mantenedor_getNombreSubtipoDiligencia,
  mantenedor_getNombreTipoDiligencia, mantenedor_getCodigoTipoDiligencia
} = useMantenedorStore()

// diligencias sugeridas filtradas temporalmente hasta que llegue la data correctamente
const props = defineProps({
  diligenciasFiltradas: propTypes.object,
  isDisabled: { type: Boolean, default: false },
  isLoadingSugeridas: { type: Boolean, default: true }
})

onUpdated(() => {
  getData()
})

const paginacionTemporal = ref([])
function getData (pagination = 0) {
  if (pagination.page !== (1 || 2)) paginacionTemporal.value = props.diligenciasFiltradas.slice(0, 10)
  if (pagination.page === 1) paginacionTemporal.value = props.diligenciasFiltradas.slice(10, 20)
  if (pagination.page === 2) paginacionTemporal.value = props.diligenciasFiltradas.slice(20)
}

function abrirModalInstruirDiligenciaSugerida (dataDiligenciaSeleccionada) {
  dialog.open(ModalInstruirDiligenciaSugerida, {
    props: {
      header: `Instruir Diligencia Sugerida Código ${dataDiligenciaSeleccionada.codigo}`,
      style: {
        width: '90%'
      },
      modal: true
    },
    data: {
      isSugerida: !!dataDiligenciaSeleccionada,
      diligenciaSugerida: dataDiligenciaSeleccionada || undefined
    },
    onClose: async ({ data }) => {
      console.log(data)
    }
  })
}

</script>
