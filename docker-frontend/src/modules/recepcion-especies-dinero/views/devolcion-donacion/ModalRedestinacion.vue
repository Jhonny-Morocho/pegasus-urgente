<template>
<div>
  <p><strong>RUC: </strong></p>
  <p><strong>NUE: </strong></p>
  <p><strong>RUE: </strong></p>

  <p class="text-yellow-600"><strong>Monto: </strong></p>
  <p class="text-yellow-600"><strong>Cheque: </strong></p>

  <p class="text-center mt-4 "><strong>{{ data?.message}}</strong></p>
</div>
</template>

<script setup>
import { propTypes } from "@/modules/common/types";
import defineProps from 'vue';

defineProps({
  data: propTypes.object
})
</script>

<style scoped>
p{
  margin: 20px 0 20px 0;
}
</style>