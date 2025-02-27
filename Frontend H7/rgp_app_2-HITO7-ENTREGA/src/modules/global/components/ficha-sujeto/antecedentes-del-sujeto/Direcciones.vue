<template>
<AppDataTable
  id="direcciones-sujeto"
  class="col-12"
  v-bind="$attrs"
>
  <Column
    field="tipoDireccion"
    header="Tipo de dirección "
  >
    <template #body="slotProps">
      {{ mantenedor_getTipoDireccionById(slotProps.data.idTipoDireccion) }}
    </template>
  </Column>
  <Column
    field="direccion"
    header="Dirección"
  >
    <template #body="{ data }">
      {{ data.calle + " " + data.idComuna + " " + data.idRegion || "N/A" }}
    </template>
  </Column>
  <Column
    field="comuna"
    header="Comuna"
  >
    <template #body="slotProps">
      {{ slotProps.data.idComuna }}
    </template>
  </Column>
  <Column
    field="region"
    header="Región"
  >
    <template #body="slotProps">
      {{ slotProps.data.idRegion }}
    </template>
  </Column>
  <Column
    field="telefonoMovil"
    header="Teléfono (Móvil, Fijo)."
  >
    <template #body="slotProps">
      {{ slotProps.data.telefonoMovil || "N/A" }}
    </template>
  </Column>
  <Column
    field="correo"
    header="Correo Electrónico"
  >
    <template #body="slotProps">
      {{ slotProps.data.correo || "N/A" }}
    </template>
  </Column>
  <Column
    field="fechaRegistro"
    header="Fecha de Registro"
  >
    <template #body="slotProps">
      {{ slotProps.data.fechaRegistro || "N/A" }}
    </template>
  </Column>
  <Column header="Acciones">
    <template #body="slotProps">
      <AppMenuOptions
        v-model="direccionSeleccionada"
        :auto-z-index="false"
        :menu-options="accionesDireccion"
        :slot-props="slotProps"
        :z-base-index="99999"
      />
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>
import { useAppDialog } from '@/modules/common/composables'
import { ref } from 'vue'
import ModalVerDireccionFichaSujeto from '@/modules/global/components/ficha-sujeto/modals/ModalVerDireccionFichaSujeto.vue'
import { useMantenedorStore } from '@/modules/global/composables'

const direccionSeleccionada = ref(null)
const { launchDialog } = useAppDialog()
const { mantenedor_getTipoDireccionById } = useMantenedorStore()

const accionesDireccion = ref([
  {
    label: 'Acciones',
    items: [
      {
        label: 'Ver Dirección',
        command: () => {
          abrirModalVerDireccion()
        }
      }
    ]
  }
])
function abrirModalVerDireccion () {
  launchDialog({
    component: ModalVerDireccionFichaSujeto,
    props: {
      coordenadasDireccion: direccionSeleccionada.value.geolocalizacion
    },
    header: 'Ver Dirección',
    width: '40%',
    cancelIcon: '',
    cancelLabel: 'Cerrar'
  })
}
</script>
