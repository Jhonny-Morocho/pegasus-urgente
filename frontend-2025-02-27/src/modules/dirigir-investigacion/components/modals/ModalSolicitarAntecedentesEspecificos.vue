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
          icon="pi pi-times"
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
      @solicitar-antecedente="openModalSolicitud"
    />
  </div>

  <div class="w-full px-3">
    <TablaAntecedentesEspecificosSolicitados
      has-pedir-cuenta
      :value="antecedentesSolicitados"
      @ver-respuesta="verRespuestaSolicitud"
    />
  </div>
</AppFieldset>
</template>

<script setup>
import { ref, onMounted, computed, h } from 'vue'
import { requestUtil, appUtil } from '@/utils'
import { useAppToast } from '@/modules/common/composables'
import { useMantenedorStore } from '@/modules/global/composables'
import { useDialog } from 'primevue/usedialog'
import { useSolicitudAntecedentesStore, useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import Button from 'primevue/button'
import TablaAntecedentesEspecificosDisponibles from '@/modules/asignacion/components/modals/solicitar-antecedentes-especificos/TablaAntecedentesEspecificosDisponibles.vue'
import TablaAntecedentesEspecificosSolicitados from '@/modules/asignacion/components/modals/solicitar-antecedentes-especificos/TablaAntecedentesEspecificosSolicitados.vue'
import ModalRespuestaSolicitud from '@/modules/dirigir-investigacion/components/modals/solicitar-antecedentes-especificos/ModalRespuestaSolicitud.vue'
import ModalCompletarSolicitud from '@/modules/dirigir-investigacion/components/modals/solicitar-antecedentes-especificos/ModalCompletarSolicitud.vue'

const dialog = useDialog()
const { toastSuccess } = useAppToast()
const { includeWord } = appUtil

const {
  mantenedor_getTiposAntecedentes,
  mantenedor_getTiposAntecedentesByOrigen,
  mantenedor_getTiposOrigenAntecedentes,
  mantenedor_getDescripcionOrigenAntecedente,
  tiposAntecedentes,
  tiposOrigenAntecedentes
} = useMantenedorStore()

const {
  antecedentesSolicitados,
  solicitudAntecedentes_getAntecedentesSolicitados,
  solicitudAntecedentes_solicitarAntecedenteEspecifico
} = useSolicitudAntecedentesStore()

const {
  ruc
} = useDirigirInvestigacionStore()

async function getDataMantenedor () {
  requestUtil({ action: mantenedor_getTiposAntecedentes })
  requestUtil({ action: mantenedor_getTiposOrigenAntecedentes })
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

async function getAntecedentesSolicitados () {
  requestUtil({
    action: solicitudAntecedentes_getAntecedentesSolicitados,
    payload: {
      ruc: ruc.value
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

function openModalSolicitud (antecedente) {
  dialog.open(ModalCompletarSolicitud, {
    props: {
      header: 'Completar Información de la Solicitud',
      modal: true,
      style: {
        width: '80%'
      }
    },
    data: {
      antecedente
    },
    onClose: async ({ data: solicitud }) => {
      if (solicitud) {
        solicitarAntecedenteEspecifico(solicitud)
      }
    }
  })
}

function verRespuestaSolicitud (antecedente) {
  const modal = dialog.open(ModalRespuestaSolicitud, {
    props: {
      header: 'Respuesta de la Solicitud',
      modal: true,
      style: {
        width: '70%'
      }
    },
    data: {
      ruc: ruc.value,
      antecedente: antecedente
    },
    templates: {
      footer: () => {
        return [
          h(Button, { label: 'Cerrar', onClick: () => modal.close(), class: 'p-button-text' })
        ]
      }
    }
  })
}
</script>
