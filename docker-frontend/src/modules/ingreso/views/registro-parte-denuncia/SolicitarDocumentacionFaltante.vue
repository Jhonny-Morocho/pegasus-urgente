<template>
<div>
  <AppFieldset
    class="col-12"
    legend="Panel de Parte/Denuncia"
  >
    <table class="col-12 pb-5">
      <caption />
      <thead class="head">
        <tr>
          <th class="text-left">
            Institución de Origen:
          </th>
          <th class="text-left">
            N° de Parte/Denuncia:
          </th>
          <th class="text-left">
            Fecha Recepción:
          </th>
          <th class="text-left">
            Delito:
          </th>
          <th class="text-left">
            Fecha Solicitud:
          </th>
        </tr>
      </thead>
      <tbody class="body">
        <tr>
          <td>PDI GRAN AVENIDA</td>
          <td>24680</td>
          <td>21-06-2019</td>
          <td>707-Infanticidio ART. 394</td>
          <td>22-06-2019</td>
        </tr>
      </tbody>
    </table>
  </AppFieldset>
  <div class="flex pt-5 justify-content-between p-0">
    <AppFieldset
      class="col"
      legend="Documentos a solicitar"
    >
      <AppDataTable
        id="dataTableProcedimientos"
        class="mt-5 mb-5 col-12"
      >
        <Column header="Solicitar">
          slotProps
        </Column>
        <Column header="Nombre Documento">
          slotProps
        </Column>
        <Column header="Tipo Documento">
          slotProps
        </Column>
      </AppDataTable>
    </AppFieldset>
    <div class="spacer" />
    <AppFieldset
      class="col"
      legend="Documentos Solicitados"
    >
      <AppDataTable
        id="dataTableProcedimientos"
        class="mt-5 mb-5 col-12"
        :value="array"
      >
        <Column header="Tipo Documento">
          <template #body="slotProps">
            {{ slotProps.data.tipoDocumento }}
          </template>
        </Column>
        <Column header="Nombre Documento">
          <template #body="slotProps">
            {{ slotProps.data.nombreDocumento }}
          </template>
        </Column>
        <Column header="Estado">
          <template #body="slotProps">
            {{ slotProps.data.estado }}
          </template>
        </Column>
        <Column header="Acciones">
          <template #body="slotProps">
            <Button
              class="p-button-rounded p-button-warning p-button-outlined mr-2"
              icon="pi pi-pencil"
              @click="handleEditarDelito(slotProps.data)"
            />
          </template>
        </Column>
      </AppDataTable>
    </AppFieldset>
  </div>
</div>
</template>
<script setup>
import { ref } from 'vue'

const array = ref([
  {
    tipoDocumento: 'asd',
    nombreDocumento: 'asd',
    estado: 'wstado'
  }
])
</script>

<style scoped>
.spacer {
  width: 40px !important;
}

.head {
  font-size: 13px;
}

.head > tr > th {
  padding: 2rem 3px 15px 0px;
}

.body {
  font-size: 12px;
}
</style>
