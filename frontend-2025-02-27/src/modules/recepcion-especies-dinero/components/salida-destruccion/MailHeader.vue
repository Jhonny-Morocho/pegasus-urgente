<template>
<div>
  <div class="col-12 grid">
    <div class="col-6">
      <div class="w-full flex flex-direction-row my-3">
        <div class="col-3 mr-4"><p><strong>MAT: </strong></p></div>
        <div><p>Entrega de NUES</p></div>
      </div>
      <div class="w-full flex flex-direction-row my-3">
        <div class="col-3 mr-4"><p><strong>De: </strong></p></div>
        <div>
          <p>María González</p>
          <p>Fiscal Jefe</p>
          <p>Fiscalía Local</p>
          <p>Fiscalía Regional Valparaíso</p>
        </div>
      </div>
      <div class="w-full flex flex-direction-row my-3">
        <div class="col-3 mr-4"><p><strong>A: </strong></p></div>
        <div>
          <p>María González</p>
          <p>Fiscal Jefe</p>
        </div>
      </div>
    </div>
    <div class="col-6">
      <div class="w-full flex flex-direction-row my-3">
        <div class="col-3 mr-4"><p><strong>RUC: </strong></p></div>
        <div class=""><p>23.234.234-4</p></div>
      </div>
      <div class="w-full flex flex-direction-row my-3">
        <div class="col-3 mr-4"><p><strong>Oficio N°: </strong></p></div>
        <div class=""><p>123</p></div>
      </div>
      <div class="w-full flex flex-direction-row my-3">
        <div class="col-3 mr-4"><p><strong>Fecha: </strong></p></div>
        <div class=""><p>23-03-2022</p></div>
      </div>
    </div>
  </div>
  <div class="box my-4">
    {{ data?.texto || "Texto de muestra ...." }}
  </div>
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
.box {
  border: 1px solid #000000;
  border-radius: 10px;
  height: 119px;
  padding: 25px;
}
</style>