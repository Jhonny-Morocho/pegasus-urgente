<template>
<section>
  <AppDataTable
    id="antecedentes-solicitados"
    class="col-12"
    v-bind="$attrs"
  >
    <template #header>
      <div class="flex justify-content-start align-items-center">
        <h3 class="mb-2">
          Antecedentes Especificos Solicitados
        </h3>
      </div>
    </template>
    <template #empty>
      No existen antecedentes solicitados
    </template>
    <Column header="Antecedente Solicitados">
      <template #body="{data}">
        {{ data.antecedentesSolicitados }}
      </template>
    </Column>
    <Column header="Origen">
      <template #body="{data}">
        {{ data.origen }}
      </template>
    </Column>
    <Column header="Ámbito">
      <template #body="{data}">
        <span class="capitalize">{{ data.ambito }}</span>
      </template>
    </Column>
    <Column header="Tipo Sujeto / Familia Especie">
      <template #body="{data}">
        {{ data.tipoSujeto || data.familiaEspecie }}
      </template>
    </Column>
    <Column header="Sujeto / Tipo Especie">
      <template #body="{data}">
        {{ data.sujeto || data.familiaEspecie }}
      </template>
    </Column>
    <Column header="Fecha de Solicitud">
      <template #body="{data}">
        {{ formatDate(data.fechaSolicitud) }}
      </template>
    </Column>
    <Column header="Estado">
      <template #body="{data}">
        {{ data.estado }}
      </template>
    </Column>
    <Column header="Acciones">
      <template #body="slotProps">
        <AppMenuOptions
          v-model="antecedenteSeleccionado"
          :auto-z-index="false"
          :menu-options="opcionesTablaSolicitados"
          :slot-props="slotProps"
          :z-base-index="99999"
        />
      </template>
    </Column>
  </AppDataTable>
</section>
</template>

<script setup>
import { ref } from 'vue'
import { dateTimeUtil } from '@/utils'
import { useDialog } from 'primevue/usedialog'
import ModalRespuestaSolicitud from '@/modules/asignacion/components/modals/solicitar-antecedentes-especificos/ModalRespuestaSolicitud.vue'

const dialog = useDialog()

const antecedenteSeleccionado = ref(null)

function abrirModalRespuestaSolicitud () {
  dialog.open(ModalRespuestaSolicitud, {
    data: {},
    props: {
      header: 'Respuesta Solicitud',
      modal: true,
      autoZIndex: false,
      baseZIndex: 99999,
      dismissableMask: true,
      style: {
        width: '72%',
        'max-width': '600px'
      }
    }
  })
}

const opcionesTablaSolicitados = ref([
  {
    label: 'Acciones Antecedentes',
    items: [
      {
        label: 'Ver Respuesta',
        command: () => {
          abrirModalRespuestaSolicitud()
        }
      },
      {
        label: 'Re-Solicitar',
        command: () => {
          console.log('TODO: re-solicitar')
        }
      }
    ]
  }
])

function formatDate (date) {
  return dateTimeUtil.formatToFrontend(date)
}
</script>
