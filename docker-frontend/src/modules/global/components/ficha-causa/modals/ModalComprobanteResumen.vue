<template>
<section class="flex flex-column grid mx-4">
  <h3>Datos Causa</h3>
  <div class="grid mt-1">
    <div class="col-6 flex flex-row  mt-2 ">
      <div class="col-4 flex flex-column  ">
        <p><strong>RUC: </strong></p>
        <p class="my-1">
          <strong>Fecha de Creación: </strong>
        </p>
        <p class="my-1">
          <strong>Fiscalía: </strong>
        </p>
        <p class="my-1">
          <strong>Fiscal Asigando: </strong>
        </p>
        <p class="my-1">
          <strong>Tipo de Denuncia: </strong>
        </p>
      </div>
      <div class="col-8 flex flex-column  ">
        <p>{{ dataCausa?.ruc }}</p>
        <p>{{ dataCausa?.fechaCreacion }}</p>
        <p>{{ dataCausa?.fiscalia }}</p>
        <p>{{ dataCausa?.fiscalAsignado }}</p>
        <p>{{ dataCausa?.tipoDenuncia }}</p>
      </div>
    </div>
    <div class="col-6 flex flex-row  mt-2 ">
      <div class="col-4 flex flex-column  ">
        <p class="my-1">
          <strong>Nombre Denunciante: </strong>
        </p>
        <p class="my-1">
          <strong>Nombre Víctima(s): </strong>
        </p>
        <p class="my-1">
          <strong>Nombre Imputado(s): </strong>
        </p>
        <p><strong>Tipo de Delito: </strong></p>
      </div>
      <div class="col-8 flex flex-column  ">
        <p>{{ dataCausa?.nombreDenunciante }}</p>
        <p>{{ dataCausa?.nombresVictimas }}</p>
        <p>{{ dataCausa?.nombresImputados }}</p>
        <p>{{ dataCausa?.tipoDelito }}</p>
      </div>
    </div>
  </div>
  <div>
    <h3 class="mb-2">
      Servicios Solicitados
    </h3>
    <AppDataTable
      :value="dataAntecedentes"
    >
      <Column header="Antecedentes Solicitados">
        <template #body="{ data }">
          {{ data?.informeParentesco }}
        </template>
      </Column>
      <Column header="Ámbito">
        <template #body="{ data }">
          {{ data?.ambito }}
        </template>
      </Column>
      <Column header="Tipo">
        <template #body="{ data }">
          {{ data?.tipo }}
        </template>
      </Column>
      <Column header="Referencia">
        <template #body="{ data }">
          {{ data?.referencia }}
        </template>
      </Column>
      <Column header="Fecha Solicitud">
        <template #body="{ data }">
          {{ data?.fechaSolicitud }}
        </template>
      </Column>
    </AppDataTable>
  </div>
  <div>
    <h4>Documentos Adjuntos</h4>
    <AppDataTable
      :value="dataDocumentos"
    >
      <Column header="Nombre Archivo">
        <template #body="{ data }">
          {{ data?.nombreArchivo }}
        </template>
      </Column>
      <Column header="Descripción Archivo">
        <template #body="{ data }">
          {{ data?.descripcionArchivo }}
        </template>
      </Column>
      <Column header="Tipo de Archivo">
        <template #body="{ data }">
          {{ data?.tipoArchivo }}
        </template>
      </Column>
    </AppDataTable>
  </div>
</section>
</template>

<script setup>
import { defineProps } from 'vue'
import { propTypes } from '@/modules/common/types/prop.types'

defineProps({
  dataCausa: propTypes.object,
  dataAntecedentes: propTypes.array,
  dataDocumentos: propTypes.array
})
</script>

<style lang="scss" scoped>
p {
  padding-bottom: 8px;
}
</style>
