<template>
<AppFieldset
  legend="Solicitar Antecedentes Específicos"
>
  <div class="grid w-full mb-4">
    <div class="col-12 md:col-4 pl-4">
      <div
        class="p-inputgroup"
        style="height: 36px; margin-top: 6px"
      >
        <Dropdown
          id="origen"
          v-model="filtroOrigen"
          option-label="descripcion"
          option-value="id"
          :options="tiposOrigenAntecedentes"
          placeholder="Filtrar por Origen"
          @change="filtrarPorOrigen"
        />
        <Button
          class="p-button-info"
          icon="pi pi-arrow-left"
          @click="resetfiltroOrigen"
        />
      </div>
    </div>
    <div class="col-12 md:col-4 md:col-offset-4">
      <div
        class="p-inputgroup px-2"
        style="height: 36px; margin-top: 6px"
      >
        <InputText
          v-model="filtroTexto"
          placeholder="Buscar"
        />
      </div>
    </div>
  </div>

  <div class="w-full px-3 mb-4">
    <TablaAntecedentesEspecificosDisponibles
      :value="antecedentesEspecificos"
      @solicitar-antecedente="handleSolicitarAntecedente"
    />
  </div>

  <div class="w-full px-3">
    <TablaAntecedentesEspecificosSolicitados
      :value="antecedentesSolicitados"
    />
  </div>
</AppFieldset>
</template>

<script setup>
import { ref, inject, onMounted, reactive, computed } from 'vue'
import { requestUtil, appUtil } from '@/utils'
import { useDialog } from 'primevue/usedialog'
import { useAppToast } from '@/modules/common/composables'
import { useMantenedorStore } from '@/modules/global/composables'
import { useSolicitudAntecedentesStore } from '@/modules/preclasificador/composables'
import TablaAntecedentesEspecificosDisponibles from '@/modules/asignacion/components/modals/solicitar-antecedentes-especificos/TablaAntecedentesEspecificosDisponibles.vue'
import TablaAntecedentesEspecificosSolicitados from '@/modules/asignacion/components/modals/solicitar-antecedentes-especificos/TablaAntecedentesEspecificosSolicitados.vue'
import ModalCompletarSolicitud from '@/modules/asignacion/components/modals/solicitar-antecedentes-especificos/ModalCompletarSolicitud.vue'
import Button from 'primevue/button'
import { useCausaAsignacionStore } from '../../composables'

const dialogRef = inject('dialogRef')

const data = reactive({
  ...dialogRef.value?.data
})

const { toastSuccess } = useAppToast()
const { includeWord } = appUtil

const { ruc } = useCausaAsignacionStore()

const dialog = useDialog()

const {
  mantenedor_getTiposAntecedentes,
  mantenedor_getTiposAntecedentesByOrigen,
  mantenedor_getTiposOrigenAntecedentes,
  mantenedor_getTiposAmbitoAntecedentes,
  mantenedor_getDescripcionOrigenAntecedente,
  tiposAntecedentes,
  tiposOrigenAntecedentes
} = useMantenedorStore()

const {
  antecedentesSolicitados,
  solicitudAntecedentes_getAntecedentesSolicitados,
  solicitudAntecedentes_solicitarAntecedenteEspecifico
} = useSolicitudAntecedentesStore()

async function getDataMantenedor () {
  requestUtil({ action: mantenedor_getTiposAntecedentes })
  requestUtil({ action: mantenedor_getTiposOrigenAntecedentes })
  requestUtil({ action: mantenedor_getTiposAmbitoAntecedentes })
}

onMounted(async () => {
  getDataMantenedor()
  getAntecedentesSolicitados()
})

const filtroOrigen = ref(null)

const antecedentesEspecificos = computed(() => {
  const antecedentes = tiposAntecedentes.value.map((a) => {
    return {
      idAntecedente: a.id,
      descripcionAntecedente: a.descripcion,
      idOrigen: a.idPadre,
      descripcionOrigen: mantenedor_getDescripcionOrigenAntecedente(a.idPadre)
    }
  })

  if (filtroTexto.value) {
    return antecedentes.filter((a) => {
      return includeWord(a.descripcionAntecedente, filtroTexto.value) |
        includeWord(a.descripcionOrigen, filtroTexto.value)
    })
  }

  return antecedentes
})

const filtroTexto = ref('')

async function filtrarPorOrigen () {
  requestUtil({
    action: mantenedor_getTiposAntecedentesByOrigen,
    payload: {
      idOrigen: filtroOrigen.value
    },
    resolve: () => {
      const origen = mantenedor_getDescripcionOrigenAntecedente(filtroOrigen.value)
      toastSuccess(`Filtrado por ${origen}`)
    }
  })
}

async function resetfiltroOrigen () {
  filtroOrigen.value = null

  getDataMantenedor()
}

function handleSolicitarAntecedente (antecedente) {
  dialog.open(ModalCompletarSolicitud, {
    data: {
      ruc: ruc.value,
      antecedente: antecedente
    },
    props: {
      header: 'Completar Información de la Solicitud',
      modal: true,
      style: {
        width: '72%',
        'max-width': '600px'
      }
    },
    onClose: async ({ data: payload }) => {
      if (payload) {
        solicitarAntecedenteEspecifico(payload)
      }
    }
  })
}

async function solicitarAntecedenteEspecifico (antecedente) {
  requestUtil({
    action: solicitudAntecedentes_solicitarAntecedenteEspecifico,
    payload: {
      ruc: ruc.value,
      antecedente: antecedente
    },
    resolve: async (r) => {
      console.log(r)
      getAntecedentesSolicitados()
    }
  })
}
async function getAntecedentesSolicitados (pagination = undefined) {
  requestUtil({
    action: solicitudAntecedentes_getAntecedentesSolicitados,
    payload: {
      ruc: data?.ruc,
      params: {
        page: pagination?.page,
        size: pagination?.rows
      }
    }
  })
}
</script>
