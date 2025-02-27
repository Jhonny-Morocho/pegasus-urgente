<template>
<div class="flex flex-row">
  <section>
    <p><strong>RUC: </strong>{{ diligencia?.ruc }}</p>
    <p><strong>TIPO_DILIGENCIA: </strong> {{ diligencia?.tipoDiligencia }}</p>
    <p>
      <strong>Reproducir: </strong>
      <audio
        class="mt-2"
        controls
        :src="diligencia?.grabacionUrl"
      >
        El navegador no soporta el
        <code>audio</code> elemento.
      </audio>
    </p>
  </section>
  <section>
    <p><strong>FISCAL / TURNO: </strong> {{ diligencia?.fiscalTurno }}</p>
    <p><strong>Funcionario responsable procedimiento: </strong> {{ diligencia?.funcionarioResponsable }}</p>
  </section>
</div>
</template>

<script setup>
import { defineProps } from 'vue'
import { propTypes } from '@/modules/common/types'

defineProps({
  diligencia: propTypes.object
})
</script>

<style lang="scss" scoped>
p {
  padding: 6px;
  margin-bottom: 4px;
}
</style>
