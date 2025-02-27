<template>
<section class="w-full">
  <AppDataTable v-bind="$attrs">
    <Column
      class="flex justify-content-center"
      header="Seleccionar"
    >
      <template #body="{ data }">
        <div class="field-radiobutton flex justify-content-center align-items-center my-1">
          <RadioButton
            id="especie"
            v-model="especie"
            name="especie"
            :value="data"
            @change="updateEspecieSeleccionada"
          />
        </div>
      </template>
    </Column>
    <Column header="Familia Especie">
      <template #body="{ data }">
        {{ data?.familiaEspecie }}
      </template>
    </Column>
    <Column header="Tipo Especie">
      <template #body="{ data }">
        {{ data?.tipoEspecie }}
      </template>
    </Column>
    <Column header="Motivo de Especie">
      <template #body="{ data }">
        {{ data?.motivoEspecie }}
      </template>
    </Column>
    <Column header="RUE">
      <template #body="{ data }">
        {{ data?.rue }}
      </template>
    </Column>
    <Column header="NUE">
      <template #body="{ data }">
        {{ data?.nue }}
      </template>
    </Column>
    <Column header="Cantidad">
      <template #body="{ data }">
        {{ data?.cantidad }}
      </template>
    </Column>
    <Column header="Delito Asociado">
      <template #body="{ data }">
        {{ data?.delitoAsociado }}
      </template>
    </Column>
    <Column header="Lugar Almacenamiento">
      <template #body="{ data }">
        {{ data?.lugarAlmacenamiento }}
      </template>
    </Column>
  </AppDataTable>
</section>
</template>
<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { propTypes } from '@/modules/common/types'

const props = defineProps({
  especieSeleccionada: propTypes.object
})

const emit = defineEmits(['update:especieSeleccionada'])

const especie = ref(props.modelValue)

function updateEspecieSeleccionada () {
  emit('update:especieSeleccionada', especie.value)
}

</script>
