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
            id="sujeto"
            v-model="sujeto"
            name="sujeto"
            :value="data"
            @change="updateSujetoSeleccionado"
          />
        </div>
      </template>
    </Column>
    <Column header="Tipo Sujeto">
      <template #body="{ data }">
        {{ data?.descripcionTipoSujeto }}
      </template>
    </Column>
    <Column header="N° Documento">
      <template #body="{ data }">
        {{ data?.numeroDocumento }}
      </template>
    </Column>
    <Column header="Nombre Completo">
      <template #body="{ data }">
        {{ data?.nombres }}
      </template>
    </Column>
    <Column header="Edad">
      <template #body="{ data }">
        {{ data?.edad }}
      </template>
    </Column>
    <Column header="Alerta">
      <template #body="{ data }">
        <div class="flex justify-content-around">
          <ChipAlerta
            v-for="(alerta, index) in data.alerta"
            :key="index"
            :alerta="alerta"
          />
        </div>
      </template>
    </Column>
    <Column header="Dirección">
      <template #body="{ data }">
        {{ data?.direccion }}
      </template>
    </Column>
  </AppDataTable>
</section>
</template>
<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { propTypes } from '@/modules/common/types'
import ChipAlerta from '@/modules/global/components/utilities/ChipAlerta.vue'

const props = defineProps({
  sujetoSeleccionado: propTypes.object
})

const emit = defineEmits(['update:sujetoSeleccionado'])

const sujeto = ref(props.modelValue)

function updateSujetoSeleccionado () {
  emit('update:sujetoSeleccionado', sujeto.value)
}

</script>
