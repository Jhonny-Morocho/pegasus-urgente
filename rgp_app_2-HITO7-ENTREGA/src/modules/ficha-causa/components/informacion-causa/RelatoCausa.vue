<template>
<AppEditor
  id="relato-causa"
  v-model="relatoCausa"
  class="w-full"
  readonly
/>
</template>

<script setup>
import { defineProps, ref } from 'vue'
import { propTypes } from '@/modules/common/types'
import AppEditor from '@/modules/common/components/inputs/AppEditor.vue'

const props = defineProps({
  relato: propTypes.string
})

const relatoCausa = ref(props.relato)
</script>
