<template>
<section class="w-full">
  <AppDataTable
    :total-records="acciones.length"
    :value="acciones"
  >
    <Column header="Acción">
      <template #body="{ data }">
        <Button
          v-tooltip="'Presionar el nombre para ir a la acción'"
          class="p-button-text btn-primary-outline text-left"
          :label="data.tarea"
          @click="data.command"
        />
      </template>
    </Column>
    <Column
      class="text-center"
      header="Acciones"
    >
      <template #body="{ data }">
        <AppMenuOptions
          v-model="accionSeleccionada"
          :menu-options="accionesTabla"
          :slot-props="data"
        />
      </template>
    </Column>
  </AppDataTable>
</section>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { useDialog } from 'primevue/usedialog'
import { useAppToast } from '@/modules/common/composables'
import AppMenuOptions from '@/modules/common/components/AppMenuOptions.vue'
import ModalConsultaRF from '@/modules/dirigir-investigacion/components/modals/desarrollo-de-la-investigacion/ModalConsultaRF.vue'

const emit = defineEmits([
  'solicitar:formalizacion',
  'solicitar:medidasCautelares',
  'solicitar:detencion',
  'solicitar:otrasSolicitudes',
  'actualizar:directriz',
  'solicitar:diligencias'
])

const router = useRouter()

const dialog = useDialog()

const { toastSuccess } = useAppToast()

const accionSeleccionada = ref()

const accionesTabla = ref([
  {
    label: 'Acciones para la tarea',
    items: [
      {
        label: 'Ejecutar Tarea',
        disabled: true
      },
      {
        label: 'Ver Proceso',
        disabled: true
      },
      {
        label: 'Ver Relaciones',
        disabled: true
      }
    ]
  }
])

const acciones = [
  {
    tarea: 'Actualizar Directriz de Investigación',
    command: () => emit('actualizar:directriz')
  },
  {
    tarea: 'Consultar FR',
    command: () => {
      dialog.open(ModalConsultaRF, {
        props: {
          header: 'Consultar al Fiscal Regional',
          style: {
            width: '40vw'
          },
          modal: true
        },
        onClose: (options) => {
          const data = options.data
          if (data) {
            toastSuccess('Consulta Enviada!')
          }
        }
      })
    }
  },
  {
    tarea: 'Solicitar Audiencia de Formalización',
    command: () =>
      emit('solicitar:formalizacion', {
        subActividad: '241',
        subSubActividad: '15'
      })
  },
  {
    tarea: 'Solicitar Medidas Cautelares o Intrusivas ',
    command: () =>
      emit('solicitar:medidasCautelares', {
        subActividad: '2412',
        subSubActividad: null
      })
  },
  {
    tarea: 'Solicitar Orden de Detención',
    command: () =>
      emit('solicitar:detencion', {
        subActividad: '5029',
        subSubActividad: null
      })
  },
  {
    tarea: 'Definir e Instruir Diligencias',
    command: () => emit('solicitar:diligencias')
    // command: () => router.push({ name: 'DIInstruirDiligencias' })
  },
  {
    tarea: 'Registrar Autorización de Medidas Intrusivas',
    command: () =>
      router.push({ name: 'DIRegistroAutorizacionTelefonicaMedidas' })
  },
  {
    tarea: 'Otras Solicitudes',
    command: () => emit('solicitar:otrasSolicitudes')
  }
]
</script>
