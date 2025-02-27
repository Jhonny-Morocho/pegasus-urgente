<template>
<h2>lo recibo</h2>
<!-- <ShowTwoColumnData
  :data-col1="dataRecepcioncheque.dataRecepcion1"
  :data-col2="dataRecepcioncheque.dataRecepcion2"
/> -->
</template>
<script setup>
import { propTypes } from '@/modules/common/types'
import { defineProps } from 'vue'
// import ShowTwoColumnData from '@/modules/recepcion-especies-dinero/components/global/ShowTwoColumnData.vue'

defineProps({
  dataRecepcioncheque: propTypes.object
})
</script>
