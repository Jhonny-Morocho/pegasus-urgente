<template>
<section>
  <ShowTwoColumnData
    :data-col1="data.dataCol1"
    :data-col2="data.dataCol2"
  />
</section>
</template>

<script setup>
import ShowTwoColumnData from '@/modules/recepcion-especies-dinero/components/global/ShowTwoColumnData.vue'
import { propTypes } from '@/modules/common/types'
import { defineProps } from 'vue'

defineProps({
  data: propTypes.object
})
</script>
