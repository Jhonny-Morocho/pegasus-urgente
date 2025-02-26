<template>
<section class="w-full">
  <AppDataTable
    id="tabla-causas-relacionadas"
    v-bind="$attrs"
  >
    <template #header>
      <div class="mb-3">
        <h2>Causas Encontradas</h2>
      </div>
    </template>
    <template #empty>
      No se encontraron Causas Relacionadas.
    </template>
    <template #loading>
      Cargando, espere un momento.
    </template>
    <Column
      header-style="width: 3rem"
      selection-mode="multiple"
    />
    <Column
      header="RUC"
    >
      <template #body="{ data }">
        <p class="w-max">
          {{ data?.rolUnico }}
        </p>
      </template>
    </Column>
    <Column header="Víctima">
      <template #body="{ data }">
        <div v-if="existenVictimas(data?.intervinientes)">
          <ul
            v-for="sujeto in data?.intervinientes"
            :key="sujeto?.numeroDocumento"
            class="list-none pl-0"
          >
            <li v-if="esVictima(sujeto)">
              {{ sujeto?.nombre }}
            </li>
          </ul>
        </div>
        <div v-else>
          Sin Víctimas
        </div>
      </template>
    </Column>
    <Column header="Imputado">
      <template #body="{ data }">
        <div v-if="existenImputados(data?.intervinientes)">
          <ul
            v-for="sujeto in data?.intervinientes"
            :key="sujeto?.numeroDocumento"
            class="list-none pl-0"
          >
            <li v-if="esImputado(sujeto?.idTipoInterviniente)">
              {{ sujeto?.nombre }}
            </li>
          </ul>
        </div>
        <div v-else>
          Sin Imputados
        </div>
      </template>
    </Column>
    <Column header="Estado">
      <template #body="{ data }">
        {{ estadoCausa(data?.estadoCausa) }}
      </template>
    </Column>
    <Column header="Delito">
      <template #body="{ data }">
        <ul
          v-for="delito in data?.delitos"
          :key="delito?.idDetalleHechoDelictual"
          class="list-none pl-0"
        >
          <li
            v-if="tipoDelito(delito?.idTipoDelito).length > 60"
            v-tooltip.top="tipoDelito(delito?.idTipoDelito)"
          >
            {{ tipoDelito(delito?.idTipoDelito).substring(0,60) + '...' }}
          </li>
          <li
            v-else
          >
            {{ tipoDelito(delito?.idTipoDelito) }}
          </li>
        </ul>
      </template>
    </Column>
    <Column header="Fecha Delito">
      <template #body="{ data }">
        <ul
          v-for="delito in data?.delitos"
          :key="delito?.idDetalleHechoDelictual"
          class="list-none pl-0"
        >
          <li v-if="delito.fechaHoraDelito">
            {{ dateTimeUtil.formatToFrontendWithTime(delito.fechaHoraDelito) }}
          </li>
          <li
            v-else
          >
            Sin Información
          </li>
        </ul>
      </template>
    </Column>
    <Column header="VIF">
      <template #body="{ data }">
        <ul
          v-for="delito in data?.delitos"
          :key="delito?.idDetalleHechoDelictual"
          class="list-none pl-0"
        >
          <li
            v-if="delito.esVif"
            class="pi pi-exclamation-triangle"
            style="font-size: 1.5rem; color: red"
          />
          <p v-else>
            --
          </p>
        </ul>
      </template>
    </Column>
  </AppDataTable>
</section>
</template>
<script setup>
import { useMantenedorStore } from '@/modules/global/composables'
import { dateTimeUtil } from '@/utils'

const {
  mantenedor_getNombreTipoDelito,
  mantenedor_getCodigoTipoSujeto,
  mantenedor_getDescripcionEstadoCausaById
} = useMantenedorStore()

function tipoDelito (idTipoDelito) {
  return mantenedor_getNombreTipoDelito(idTipoDelito)
}
function esVictima (sujeto) {
  return (mantenedor_getCodigoTipoSujeto(sujeto.idTipoInterviniente) === '1' &&
      sujeto.esVictima) || // 1: 'Denunciante - Victima'
    mantenedor_getCodigoTipoSujeto(sujeto.idTipoInterviniente) === '6'
  // 6: 'Víctima'
}

function esImputado (idTipoInterviniente) {
  return mantenedor_getCodigoTipoSujeto(idTipoInterviniente) === '3' // 3: 'Imputado'
}

function estadoCausa (idEstadoCausa) {
  if (!idEstadoCausa) {
    return 'Estado Desconocido'
  }
  return (
    mantenedor_getDescripcionEstadoCausaById(idEstadoCausa) ||
    'Estado Desconocido'
  )
}

function existenVictimas (sujetos) {
  return sujetos.some((s) => esVictima(s))
}

function existenImputados (sujetos) {
  return sujetos.some((s) => esImputado(s.idTipoInterviniente))
}
</script>
