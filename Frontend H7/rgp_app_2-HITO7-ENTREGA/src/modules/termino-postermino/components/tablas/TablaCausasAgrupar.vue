<template>
<AppDataTable
  class="w-full"
  v-bind="$attrs"
>
  <Column
    v-if="selectable"
    header="Seleccione Causa Principal"
    header-style="width: 5rem"
    selection-mode="single"
  />
  <Column header="RUC">
    <template #body="{ data }">
      {{ data?.ruc }}
    </template>
  </Column>
  <Column header="Nombre Causa">
    <template #body="{ data }">
      {{ data?.nombreCausa || "Causa Sin Nombre" }}
    </template>
  </Column>
  <Column header="Delito">
    <template #body="{ data }">
      <div v-if="data?.delitos?.length === 0">
        Sin Delitos Asociados
      </div>
      <div v-if="data?.delitos?.length">
        <ul
          v-for="delito in data?.delitos"
          :key="delito"
          class="list-none pl-0"
        >
          <li>
            {{ tipoDelito(delito.tipoDelito) || tipoDelito(delito.idTipoDelito) }}
          </li>
        </ul>
      </div>
      <div v-if="data?.delito">
        {{ data?.delito }}
      </div>
    </template>
  </Column>
  <Column header="Fiscalía">
    <template #body="{ data }">
      {{ data?.fiscaliaLocal }}
    </template>
  </Column>
  <Column header="Fiscal Adjunto">
    <template #body="{ data }">
      {{ data?.nombreFiscalAdjunto || "Sin Definir" }}
    </template>
  </Column>
  <Column
    v-if="!readOnly"
    class="text-center"
    header="Acciones"
  >
    <template #body="slotProps">
      <AppMenuOptions
        :menu-options="menuRelacionesItems"
        :slot-props="slotProps"
      />
    </template>
  </Column>
</AppDataTable>
</template>
<script setup>
/* eslint-disable */
import ModalHistorialAsignaciones from "@/modules/termino-postermino/components/modals/ModalHistorialAsignaciones.vue";
import { useMantenedorStore } from "@/modules/global/composables";
import { ref, defineProps } from "vue";
import { useAppDialog } from "@/modules/common/composables";

defineProps({
  readOnly: Boolean,
  selectable: Boolean,
});

const { launchDialog } = useAppDialog();

const {
  mantenedor_getNombreTipoDelito,
  // mantenedor_getDescripcionEstadoCausaById
} = useMantenedorStore();

function tipoDelito(idTipoDelito) {
  return mantenedor_getNombreTipoDelito(idTipoDelito);
}

function openModalHistorial() {
  launchDialog({
    component: ModalHistorialAsignaciones,
    header: "Historial de Asignaciones",
    width: "90%",
    accept: () => {
      // pass
    },
  });
}

const menuRelacionesItems = ref([
  {
    label: "Acciones",
    items: [
      {
        icon: "pi pi-eye",
        label: "Ver Historial",
        command: () => openModalHistorial(),
      },
    ],
  },
]);
</script>
