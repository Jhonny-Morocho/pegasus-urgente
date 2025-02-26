<template>
<section class="error">
  <div class="my-5">
    <img
      alt=""
      height="100"
      src="@/assets/images/logoFiscaliadeChile.svg"
    >
  </div>
  <h1>404 - Página no encontrada</h1>

  <div>
    <Button
      label="Volver"
      @click="$router.push('/')"
    />
  </div>
</section>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ErrorView'
})
</script>

<style lang="scss" scoped>
.error {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;

  & h1 {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
}
</style>
