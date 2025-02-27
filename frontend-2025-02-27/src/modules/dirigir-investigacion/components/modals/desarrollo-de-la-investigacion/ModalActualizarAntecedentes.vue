<template>
<div>
  <AppFieldset
    legend="Lista de Antecedentes Actualizados y en espera de Actualización"
  >
    <AppDataTable
      v-model:selection="antecedenteSeleccionado"
      class="col-12"
      :value="antecedentesActualizados"
    >
      <Column
        header="Seleccionar"
        style="width: 48px"
      >
        <template #body="{ slotProps }">
          <div class="flex justify-content-center">
            <input
              :id="slotProps"
              v-model="antecedenteSeleccionado"
              class="p-checkbox"
              type="checkbox"
              :value="data"
            >
          </div>
        </template>
      </Column>
      <Column header="Nombre del Antecedente">
        <template #body="{ data }">
          {{ data.nombreAntecedente }}
        </template>
      </Column>
      <Column header="Nombre Entidad Emisora">
        <template #body="{ data }">
          {{ data.nombreEntidadEmisora }}
        </template>
      </Column>
      <Column header="Tipo Sujeto">
        <template #body="{ data }">
          {{ data.tipoSujeto }}
        </template>
      </Column>
      <Column header="Nombre Completo">
        <template #body="{ data }">
          {{ data.nombreCompleto }}
        </template>
      </Column>

      <Column
        header="Resultado"
      >
        <template #body="{ data }">
          <Button
            class="p-button-rounded p-button-outlined p-button-raised p-button-sm"
            :icon="data.resultado? 'pi pi-check' : 'pi pi-times'"
          />
        </template>
      </Column>
      <Column
        header="Documento"
      >
        <template #body="{ }">
          <Button
            class="btn-info p-button-rounded p-button-outlined p-button-raised p-button-sm"
            icon="pi pi-file"
          />
        </template>
      </Column>
    </AppDataTable>
  </AppFieldset>
</div>
</template>

<script setup>

const antecedentesActualizados = [
  {
    nombreAntecedente: 'Certificado de Antecedentes',
    nombreEntidadEmisora: 'Servicio de Registro Civil',
    tipoSujeto: 'Imputado',
    nombreCompleto: '13-06-2021'
  },
  {
    nombreAntecedente: 'Certificado de Antecedentes',
    nombreEntidadEmisora: 'Servicio de Registro Civil',
    tipoSujeto: 'Víctima',
    nombreCompleto: 'Gustavo Sebastian Henríquez '
  }
]

</script>
