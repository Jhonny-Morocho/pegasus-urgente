<template>
<section class="col-12">
  <AppDataTable
    id="dataTableRelaciones"
    v-bind="$attrs"
  >
    <Column
      v-if="selectable"
      header-style="width: 3em"
      selection-mode="multiple"
    />
    <Column header="Tipo Sujeto">
      <template #body="{ data }">
        {{ mantenedor_getNombreTipoSujeto(data?.tipoSujeto) }}
      </template>
    </Column>
    <Column header="N° Documento">
      <template #body="{ data }">
        <p v-if="data.numeroDocumento && mantenedor_getCodigoTipoDocumentoIdentidad(data.tipoDocumento) === '1'">
          {{ data.representaInstitucion ? format(data.rutJuridico) : format(data.numeroDocumento) }}
        </p>
        <p v-else>
          {{ data.numeroDocumento ?? 'S/N' }}
        </p>
      </template>
    </Column>
    <Column header="Nombre Completo">
      <template #body="{ data }">
        {{ `${data?.nombres} ${data?.apellidoPaterno} ${data?.apellidoMaterno}` }}
      </template>
    </Column>
    <Column header="Edad">
      <template #body="{ data }">
        {{ data?.edad }}
      </template>
    </Column>
    <Column header="Alerta">
      <template #body="{ data }">
        {{ data?.alertas.length > 0 || '----' }}
      </template>
    </Column>
    <Column header="Dirección">
      <template #body="{ data }">
        {{ data.direccion ? data.direccion.calle + data.direccion.numeroCalle : 'No definido' }}
      </template>
    </Column>
    <Column header="Comuna">
      <template #body="{ data }">
        {{ mantenedor_getDescripcionComunasById(data?.idComuna) ?? 'No definido' }}
      </template>
    </Column>
    <Column
      v-if="!readOnly"
      class="text-center"
      header="Acciones"
    >
      <template #body="slotProps">
        <AppMenuOptions
          v-model="relacionSeleccionada"
          :menu-options="menuRelacionesItems"
          :slot-props="slotProps"
        />
      </template>
    </Column>
  </AppDataTable>
</section>
</template>

<script setup>
import { useMantenedorStore } from '@/modules/global/composables'
import { defineEmits, defineProps, ref } from 'vue'
import { format } from '@fiquu/cl-rut'

const {
  mantenedor_getNombreTipoSujeto,
  mantenedor_getCodigoTipoDocumentoIdentidad,
  mantenedor_getDescripcionComunasById,
  mantenedor_getTiposSujetos
} = useMantenedorStore()

mantenedor_getTiposSujetos()

defineProps({
  readOnly: Boolean,
  selectable: Boolean,
  checked: Boolean
})

const emit = defineEmits(['relacion:verMas'])

const relacionSeleccionada = ref(null)

const menuRelacionesItems = ref([
  {
    label: 'Acciones',
    items: [
      {
        icon: 'pi pi-eye',
        label: 'Ver Más',
        command: () => emit('relacion:verMas', relacionSeleccionada)
      }
    ]
  }
])
</script>
