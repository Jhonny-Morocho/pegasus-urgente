<template>
<AppFieldset
  class="p-fluid"
  legend="Observación(es) de la Cadena de Custodia"
>
  <AppDataTable
    class="col-12"
    v-bind="$attrs"
  >
    <Column header="Observación">
      <template #body="{data}">
        {{ data.Observacion }}
      </template>
    </Column>
    <Column header="Usuario">
      <template #body="{data}">
        {{ data.creado_por }}
      </template>
    </Column>
    <Column header="Fecha">
      <template #body="{ data }">
        {{ formatDate(data.fecha_creacion) }}
      </template>
    </Column>
    <Column header="Acciones">
      <template #body="slotProps">
        <AppMenuOptions
          v-model="observacionSeleccionada"
          :menu-options="opcionesObservaciones"
          :slot-props="slotProps"
        />
      </template>
    </Column>
  </AppDataTable>
</AppFieldset>
</template>

<script setup>
import { ref } from 'vue'
import ModalVerObservacion from '@/modules/recepcion-especies-dinero/components/ver-cadena-custodia/modals/ModalVerObservacion.vue'
import { useAppDialog } from '@/modules/common/composables'
// utils
import { dateTimeUtil } from '@/utils'
const { launchDialog } = useAppDialog()
const observacionSeleccionada = ref()

function openModalobservacion (data) {
  console.log('vemos la observacion', data)
  launchDialog({
    component: ModalVerObservacion,
    header: 'Ver Observación',
    width: '50%',
    props: { observacion: data },
    cancelLabel: 'Cerrar'
  })
}
function formatDate (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
}
const opcionesObservaciones = ref([
  {
    label: 'Ver Observación',
    command: () => {
      openModalobservacion(observacionSeleccionada.value.Observacion)
    }
  }
])
</script>
