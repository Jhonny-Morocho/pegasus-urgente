<template>
<p
  class="col-12"
  style="font-size:1.2em"
>
  <span class="font-bold">Monto Original:</span> {{ '$ '+montoOriginal }}
</p>
<p
  class="col-12"
  style="font-size:1.2em"
>
  <span class="font-bold">Monto Total:</span> {{ '$ '+montoTotal }}
</p>
<p
  class="col-12"
  style="font-size:1.2em"
>
  <span class="font-bold">Diferencia:</span> {{ '$ '+(montoOriginal - montoTotal) }}
</p>
</template>
<script setup>
import { defineProps } from 'vue'
import { propTypes } from '@/modules/common/types'

defineProps({
  readOnly: Boolean,
  montoOriginal: propTypes.number,
  montoTotal: propTypes.number
})
</script>
