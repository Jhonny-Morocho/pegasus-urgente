<template>
<AppDataTable
  class="w-full"
  v-bind="$attrs"
>
  <template #header>
    <div class="mb-3">
      <h3 class="text-xl">
        Causas a Agrupar
      </h3>
    </div>
  </template>
  <Column header="Ver Más">
    <template #body="{ data }">
      <Button
        class="p-button-outlined p-button-rounded p-button-lg"
        icon="pi pi-plus"
        @click="openModalVerMas(data)"
      />
    </template>
  </Column>
  <Column
    header="Seleccione Causa Principal"
    header-style="width: 5rem"
    selection-mode="single"
  />
  <Column header="RUC">
    <template #body="{ data }">
      <p class="w-max">
        {{ data?.ruc || data?.rolUnico || '--' }}
      </p>
    </template>
  </Column>
  <Column header="RUT Víctima">
    <template #body="{ data }">
      <div v-if="existenVictimas(data?.intervinientes)">
        <ul
          v-for="sujeto in data?.intervinientes"
          :key="sujeto?.numeroDocumento"
          class="list-none pl-0"
        >
          <li v-if="esVictima(sujeto?.idTipo) || sujeto.esVictima">
            <p class="w-max">
              {{ sujeto?.rut }}
            </p>
          </li>
        </ul>
      </div>
      <div v-else>
        Sin Víctimas
      </div>
    </template>
  </Column>
  <Column header="RUT Imputado">
    <template #body="{ data }">
      <div v-if="existenImputados(data?.intervinientes)">
        <ul
          v-for="sujeto in data?.intervinientes"
          :key="sujeto?.numeroDocumento"
          class="list-none pl-0"
        >
          <li v-if="esImputado(sujeto?.idTipo)">
            <p class="w-max">
              {{ sujeto?.rut }}
            </p>
          </li>
        </ul>
      </div>
      <div v-else>
        Sin Imputados
      </div>
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
          <li>{{ tipoDelito(delito.tipoDelito) || tipoDelito(delito.idTipoDelito) }}</li>
        </ul>
      </div>
      <div v-if="data?.delito">
        {{ data?.delito }}
      </div>
    </template>
  </Column>
  <Column header="Fiscalía">
    <template #body="{ data }">
      {{ data?.fiscalia || 'Fiscalía no Definida' }}
    </template>
  </Column>
  <Column header="Fiscal Asignado">
    <template #body="{ data }">
      {{ data?.fiscalAsignado || 'Fiscal no Asignado' }}
    </template>
  </Column>
  <Column header="Causa Judicializada">
    <template #body="{ data }">
      {{ data?.causaJudicializada ? 'Si' : 'No' }}
    </template>
  </Column>
  <slot name="acciones" />
</AppDataTable>
</template>

<script setup>
import { useAppDialog } from '@/modules/common/composables'
import { useMantenedorStore } from '@/modules/global/composables'
import ModalMasInfoCausaRelacionada from './ModalMasInfoCausaRelacionada.vue'

const { mantenedor_getNombreTipoDelito, mantenedor_getCodigoTipoSujeto } = useMantenedorStore()

const { launchDialog } = useAppDialog()

function tipoDelito (idTipoDelito) {
  return mantenedor_getNombreTipoDelito(idTipoDelito)
}

function esVictima (idTipoInterviniente) {
  return mantenedor_getCodigoTipoSujeto(idTipoInterviniente) === '6' // 6: 'Víctima'
}

function esImputado (idTipoInterviniente) {
  return mantenedor_getCodigoTipoSujeto(idTipoInterviniente) === '3' // 3: 'Imputado'
}

function existenVictimas (sujetos) {
  return sujetos.some((s) => esVictima(s.idTipo) || s.esVictima)
}

function existenImputados (sujetos) {
  return sujetos.some((s) => esImputado(s.idTipo))
}

function openModalVerMas (causa) {
  launchDialog({
    component: ModalMasInfoCausaRelacionada,
    header: 'Más Información de la Causa',
    width: '30%',
    props: {
      causa: causa
    },
    cancelLabel: 'Cerrar',
    cancelIcon: ''
  })
}
</script>
