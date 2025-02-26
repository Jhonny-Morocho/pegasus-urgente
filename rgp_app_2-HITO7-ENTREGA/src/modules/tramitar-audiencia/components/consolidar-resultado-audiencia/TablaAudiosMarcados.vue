<template>
<hr>
<section class="px-2 py-3 w-full">
  <AppDataTable
    class="editable-cells-table"
    edit-mode="cell"
    v-bind="{ ...$attrs }"
  >
    <Column>
      <template #body="{ index }">
        {{ index + 1 }}
      </template>
    </Column>
    <Column header="Nombre Marcador">
      <template #body="{ data }">
        {{ data.name }}
      </template>
    </Column>
    <Column header="Marcador">
      <template #body="{ data }">
        {{ data.duration }} seg
      </template>
    </Column>
    <Column header="Reproducir">
      <template #body="{ data }">
        <Button
          class="p-button-text p-button-rounded p-button-info p-button-lg"
          icon="pi pi-caret-right"
          icon-pos="center"
          @click="reproducirAudio(data)"
        />
      </template>
    </Column>
  </AppDataTable>
</section>
</template>

<script setup>
import AppDataTable from '@/modules/common/components/AppDataTable.vue'
import { defineProps } from 'vue-demi'
import { defineEmits } from 'vue'

defineProps({
  readOnly: Boolean
})

const emit = defineEmits(['play:audio'])

function reproducirAudio (data) {
  emit('play:audio', data)
}
</script>
