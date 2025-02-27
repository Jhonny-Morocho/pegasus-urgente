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
          :id="data.id"
          v-model="sujetoSeleccionado"
          class="p-checkbox"
          type="checkbox"
          :value="data"
        >
      </template>
    </Column>
    <Column header="Nº Documento">
      <template #body="{data}">
        {{ data.numeroDocumento }}
      </template>
    </Column>
    <Column header="Nombre Completo">
      <template #body="{data}">
        {{ data.nombreCompleto }}
      </template>
    </Column>
    <Column header="Edad">
      <template #body="{data}">
        {{ data.edad }}
      </template>
    </Column>
    <Column header="Delito">
      <template #body="{data}">
        {{ data.delito }}
      </template>
    </Column>
    <Column header="Fecha Detención">
      <template #body="{data}">
        {{ getFechaFormat(data.fechaDetencion) }}
      </template>
    </Column>
    <Column header="Pasar ACD">
      <template #body="{data}">
        {{ data.pasarACD }}
      </template>
    </Column>
    <Column header="juzgado">
      <template #body="{data}">
        {{ data.juzgado }}
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
      <template #body="{data}">
        {{ data.comentario }}
      </template>
    </Column>
    <Column header="Enviado">
      <template #body="{data}">
        <div class="text-center">
          <i
            v-if="data.enviado"
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
import { defineEmits, defineProps, ref } from 'vue'

import { useAppDialog, useModelWrapper } from '@/modules/common/composables'
import ModalDefinirDetenidosStepACD from '@/modules/flagrancia/components/detenidos-acd/modales/ModalDefinirDetenidosStepACD.vue'
import { propTypes } from '@/modules/common/types/prop.types'
import { dateTimeUtil } from '@/utils'

const emit = defineEmits(['detenido:editar', 'update:detenidosSeleccionados'])

defineProps({
  detenidosSeleccionados: propTypes.array
})

const { launchDialog } = useAppDialog()

const sujetoSeleccionado = ref([])

// determina si el boton enviar en el padre DetenidosACD está habilitado
// eslint-disable-next-line no-unused-vars
const localDetenidosSeleccionados = useModelWrapper('detenidosSeleccionados')

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
        idDecisionAcd: detenido.pasarACD,
        juzgado: detenido.juzgado,
        fechaPresentacionAcd: detenido.fechaPresentacionACD,
        bloque: detenido.bloque,
        comentarioAcd: detenido.comentario,
        idTipoDelito: detenido.idTipoDelito
      }
    },
    accept: (detenidoEditado) => {
      emit('detenido:editar', {
        ...detenidoEditado,
        idDetenido: detenido.idPersona
      })
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
</script>

<script>
export default {
  inheritAttrs: false
}
</script>
