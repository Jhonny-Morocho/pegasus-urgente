<template>
<section class="col-12">
  <AppDataTable
    v-bind="$attrs"
    id="tabla-sujetos"
    edit-mode="cell"
    @cell-edit-complete="onCellEditComplete"
  >
    <Column
      v-if="selectable"
      selection-mode="multiple"
    />

    <Column header="Tipo Sujeto">
      <template #body="{ data }">
        {{ mantenedor_getNombreTipoSujeto(data?.tipoSujeto) ?? mantenedor_getNombreTipoSujeto('0') }}
        {{ (mantenedor_getCodigoTipoSujeto(data?.tipoSujeto) || data?.tipoSujeto) === '1' && data.esVictima ? '(Víctima)' : '' }}
      </template>
    </Column>
    <Column header="N° Documento">
      <template #body="{ data }">
        {{ data?.numeroDocumento }}
      </template>
    </Column>
    <Column header="Nombre Completo">
      <template #body="{ data }">
        {{ data?.nombres }}
      </template>
    </Column>
    <Column header="Dirección">
      <template #body="{ data }">
        {{ data?.direccion || 'Sin Definir' }}
      </template>
    </Column>
    <Column header="Comuna">
      <template #body="{ data }">
        {{ data?.comuna || 'Sin Definir' }}
      </template>
    </Column>
    <Column header="Apercibido">
      <template #body>
        Si
      </template>
    </Column>
    <Column
      field="identidadProtegida"
      header="Identidad Protegida"
    >
      <template #editor="{ data, field }">
        <Checkbox
          v-model="data[field]"
          :binary="true"
        />
      </template>
      <template #body="{ data, field }">
        <Checkbox
          v-model="data[field]"
          :binary="true"
        />
      </template>
    </Column>
    <Column
      field="envioReservado"
      header="Envío Reservado al Tribunal"
    >
      <template #editor="{ data, field }">
        <Checkbox
          v-model="data[field]"
          :binary="true"
        />
      </template>
      <template #body="{ data, field }">
        <Checkbox
          v-model="data[field]"
          :binary="true"
        />
      </template>
    </Column>
    <Column
      v-if="!readOnly && !isEditando"
      header="Acciones"
    >
      <template #body="slotProps">
        <AppMenuOptions
          v-model="sujeto"
          :menu-options="opcionesSujeto"
          :slot-props="slotProps"
        />
      </template>
    </Column>
  </AppDataTable>
</section>
</template>
<script setup>
import Checkbox from 'primevue/checkbox'
import { ref, defineProps, onMounted } from 'vue'
import { useMantenedorStore } from '@/modules/global/composables'
import { requestUtil } from '@/utils'
import { propTypes } from '@/modules/common/types'

defineProps({
  readOnly: Boolean,
  isEditando: Boolean,
  selectable: Boolean,
  opcionesSujeto: propTypes.object
})

const { mantenedor_getNombreTipoSujeto, mantenedor_getCodigoTipoSujeto, mantenedor_getTiposSujetos } = useMantenedorStore()

const sujeto = ref()

function onCellEditComplete (event) {
  const { data, newValue, field } = event
  console.log({ data, newValue, field })
  const { nombres, identidadProtegida } = data
  console.log(nombres, identidadProtegida)

  data[field] = newValue
}

onMounted(() => {
  requestUtil({ action: mantenedor_getTiposSujetos })
})
</script>
