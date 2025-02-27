<template>
<AppDataTable
  class="col-12"
  :value="dataPronunciamiento.especiesDineros"
>
  <Column header="RUE">
    <template #body="{ data }">
      {{ data?.ruc }}
    </template>
  </Column>
  <Column header="NUE">
    <template #body="{ data }">
      {{ data?.nue }}
    </template>
  </Column>
  <Column header="Familia Especie">
    <template #body="{ data }">
      {{ data?.familiaEspecie }}
    </template>
  </Column>
  <Column header="Tipo Dinero">
    <template #body="{ data }">
      {{ data?.tipoDinero }}
    </template>
  </Column>
  <Column header="Descripción">
    <template #body="{ data }">
      {{ data?.descripcion }}
    </template>
  </Column>
  <Column header="Monto">
    <template #body="{ data }">
      {{ data?.monto }}
    </template>
  </Column>
  <Column
    class="text-center"
    header="Acciones"
    style="width: 0"
  >
    <template #body="slotProps">
      <AppMenuOptions
        v-model="observacionSeleccionada"
        :menu-options="opcionesObservaciones"
        :slot-props="slotProps"
      />
    </template>
  </Column>
</AppDataTable>
<div class="col-12 grid">
  <div class="col-4 mb-4 p-fluid">
    <h4 class="ml-2 col-12">
      ¿Pronuciamiento de Evidencia?
    </h4>
    <AppSelectButton
      id="pronunciamiento-evidencia"
      v-model="formData.pronunciamientoEvidencia"
      class="col-12"
      option-label="name"
      option-value="value"
      :options="[
        { name: 'Si', value: true },
        { name: 'No', value: false },
      ]"
    />
  </div>
  <div class="col-4 mt-3">
    <AppDropdown
      id="delitoPronunciamiento"
      v-model="formData.delitoPronunciamiento"
      class="col-12 p-fluid mt-3"
      label="Delito Asociado"
      :options="dataCausa.delitos"
      placeholder
      show-clear
    />
  </div>
</div>
</template>
<script setup>
import { propTypes } from '@/modules/common/types'
import { defineProps, reactive, ref, defineEmits } from 'vue'
defineProps({
  dataPronunciamiento: propTypes.object,
  dataCausa: propTypes.object
})

const formData = reactive({
  dataPronunciamientoEvidencia: '',
  delitoPronunciamiento: ''
})

const emit = defineEmits('abrir-modal-denominacion-dineros')

const dineroSeleccionado = ref(null)

const opcionesObservaciones = ref([
  {
    label: 'Ver Denominación',
    command: () => {
      emit(
        'abrir-modal-denominacion-dineros',
        dineroSeleccionado.value
      )
    }
  }
])
</script>
