<template>
<div>
  <AppFieldset
    legend="Pedir Cuenta"
  >
    <div class="col-12 mt-3">
      <AppFieldset
        legend="Nuevo Pedir Cuenta"
      >
        <div>
          <!--  -->
        </div>
      </AppFieldset>
    </div>

    <div class="col-12">
      <AppFieldset
        legend="Escrito de Salud"
      >
        <div>
          <!--  -->
        </div>
      </AppFieldset>
    </div>
  </AppFieldset>
</div>
</template>

<script setup>
import { inject, reactive } from 'vue'

const dialogRef = inject('dialogRef')

const data = reactive({
  ...dialogRef.value?.data
})
console.log('🚀 ~ file: ModalPedirCuenta.vue ~ line 15 ~ data', data)
</script>
