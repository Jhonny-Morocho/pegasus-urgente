<template>
<AppFieldset legend="Registrar entrega de cheque a custodio">
  <p>Número de serie: </p>
  <AppForm>
    <AppCalendar
      id="fechaDeFirmaCheque"
      v-model="fechaDeFirmaCheque"
      class="col-12 md:col-6 lg:col-4"
      date-format="dd-mm-yy"
      label="Fecha de Firma del Cheque"
      month-navigator
      year-navigator
      year-range="1921:2030"
    />
  </AppForm>
</AppFieldset>
</template>
