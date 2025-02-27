<template>
<AppFieldset legend="Detenidos">
  <AppDataTable
    id="tabla-detenidos"
    v-bind="$attrs"
    class="col-12"
  >
    <Column header="Enviar">
      <template #body="{ data }">
        <input
          :id="sujetoSeleccionadoEnviar"
          v-model="sujetoSeleccionadoEnviar"
          class="p-checkbox"
          :disabled="!data.idProcedimientoDetenido || data.esEnviado && data.idProcedimientoDetenido"
          type="checkbox"
          :value="data"
        >
      </template>
    </Column>
    <Column header="Nº Documento">
      <template #body="{data}">
        {{ data.numeroDocumento ?? 'Sin Información' }}
      </template>
    </Column>
    <Column header="Nombre Completo">
      <template #body="{data}">
        {{ data.nombreCompleto ?? 'Sin Información' }}
      </template>
    </Column>
    <Column header="Edad">
      <template #body="{data}">
        {{ data.edad ?? 'Sin Información' }}
      </template>
    </Column>
    <Column header="Delito">
      <template #body="{data}">
        {{ mantenedor_getNombreTipoDelito(data.idTipoDelito) }}
      </template>
    </Column>
    <Column header="Fecha Detención">
      <template #body="{data}">
        {{ getFechaFormat(data.fechaDetencion) }}
      </template>
    </Column>
    <Column header="Pasar ACD">
      <template #body="{data}">
        {{ data.idDecisionAcd }}
      </template>
    </Column>
    <Column header="juzgado">
      <template #body="{data}">
        {{ mantenedor_getNombreJuzgado(data.juzgado) }}
      </template>
    </Column>
    <Column header="Fecha de presentación a ACD">
      <template #body="{data}">
        {{ getFechaFormat(data.fechaPresentacionACD) }}
      </template>
    </Column>
    <Column header="Bloque">
      <template #body="{data}">
        {{ data.bloque }}
      </template>
    </Column>
    <Column header="Comentario">
      <template
        #body="{data}"
      >
        <p
          v-if="data.comentarioAcd?.length > 20"
          v-tooltip.top="data.comentarioAcd"
        >
          {{ formatComentario(data.comentarioAcd) }}...
        </p>
        <p v-else>
          {{ data.comentarioAcd }}
        </p>
      </template>
    </Column>
    <Column header="Enviado">
      <template #body="{data}">
        <div class="text-center">
          <i
            v-if="data.esEnviado"
            class="pi pi-check"
            style="color: green"
          />
          <i
            v-else
            class="pi pi-times p-error"
          />
        </div>
      </template>
    </Column>
    <Column header="Acciones">
      <template #body="{data}">
        <Button
          class="p-button-rounded p-button-warning p-button-outlined mr-2"
          icon="pi pi-pencil"
          @click="handleEditarDetenido(data)"
        />
      </template>
    </Column>
  </AppDataTable>
</AppFieldset>
</template>

<script setup>
import { defineEmits, defineProps, defineExpose, ref } from 'vue'

import { useAppDialog, useModelWrapper } from '@/modules/common/composables'
import ModalDefinirDetenidosStepACD from '@/modules/flagrancia/components/detenidos-acd/modales/ModalDefinirDetenidosStepACD.vue'
import { propTypes } from '@/modules/common/types/prop.types'
import { dateTimeUtil, requestUtil } from '@/utils'
import { useMantenedorStore } from '@/modules/global/composables'

const emit = defineEmits(['detenido:editar', 'update:detenidosSeleccionados'])

const {
  mantenedor_getTiposDelito, mantenedor_getNombreTipoDelito,
  mantenedor_getNombreJuzgado
} = useMantenedorStore()

defineProps({
  detenidosSeleccionados: propTypes.array
})

const { launchDialog } = useAppDialog()

const sujetoSeleccionadoEnviar = ref([])

// determina si el boton enviar en el padre DetenidosACD está habilitado
// eslint-disable-next-line no-unused-vars
const localDetenidosSeleccionados = useModelWrapper('detenidosSeleccionados')

function getDataMantenedor () {
  requestUtil({ action: mantenedor_getTiposDelito })
}
getDataMantenedor()

function handleEditarDetenido (detenido) {
  console.log(detenido)
  launchDialog({
    header: 'Detenidos Pasan ACD',
    component: ModalDefinirDetenidosStepACD,
    width: '75vw',
    confirmLabel: 'Guardar',
    props: {
      detenido: {
        ...detenido,
        comentarioAcd: detenido.comentario,
        descripcionTipoDelito: mantenedor_getNombreTipoDelito(detenido.idTipoDelito)
      }
    },
    accept: (detenidoEditado) => {
      if (detenidoEditado.idDecisionAcd.length !== 0) emit('detenido:editar', { ...detenidoEditado, idRelacionSujeto: detenido.idRelacionSujeto })
    }
  })
}
function getFechaFormat (fechaDetencion) {
  if (!fechaDetencion) {
    return ''
  }
  let fecha
  try {
    fecha = dateTimeUtil.formatToFrontend(fechaDetencion)
  } catch (e) {}

  return fecha
}

function formatComentario (comentario) {
  return comentario.slice(0, 20)
}
defineExpose({ sujetoSeleccionadoEnviar })

</script>

<script>
export default {
  inheritAttrs: false
}
</script>
