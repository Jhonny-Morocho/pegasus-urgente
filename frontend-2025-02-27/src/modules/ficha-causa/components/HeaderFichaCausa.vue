<template>
<header class="grid mt-4">
  <section class="col-12 md:col-3">
    <AppFieldset
      class="h-full"
      legend="RUC"
    >
      <h1>{{ ruc }}</h1>
    </AppFieldset>
  </section>
  <section class="col-12 md:col-6">
    <AppFieldset
      id="info-denuncia"
      class="h-full"
      legend="Identificacion Denuncia"
    >
      <LoaderSkeleton
        v-if="isLoading"
        height="10.5vh"
      />
      <ul
        v-else
        class="grid mt-3 mb-2 w-full"
      >
        <li class="col-12 md:col-6">
          <strong>Nombre Causa:</strong>
          {{ resumenCausa?.nombreCausa }}
        </li>
        <li class="col-12 md:col-6">
          <strong>Fiscalía:</strong>
          {{ resumenCausa?.nombreFiscaliaLocal }}
        </li>
        <li class="col-12 md:col-6">
          <strong>Estado de la Causa:</strong>
          {{ resumenCausa?.descripcionEstado || 'Estado Desconocido' }}
        </li>
        <li class="col-12 md:col-6">
          <strong>Fiscal Asignado: </strong>
          <span v-if="resumenCausa?.nombreFiscalAsignado">
            <Button
              class="p-button-link p-0"
              :label="resumenCausa?.nombreFiscalAsignado"
              @click="verInformacionFiscal"
            />
          </span>
          <span v-else>Sin Fiscal Asignado</span>
        </li>
      </ul>
    </AppFieldset>
  </section>
  <section
    id="pjud"
    class="col-12 md:col-3"
  >
    <AppFieldset
      class="h-full"
      legend="Antecedentes PJUD"
    >
      <div class="w-full text-center m-0">
        <img
          alt="logo-pjud"
          class="logo-pjud"
          src="@/assets/images/pjud.png"
        >
      </div>
    </AppFieldset>
  </section>
</header>
</template>

<script setup>
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import { defineProps, defineEmits } from 'vue'
import { propTypes } from '@/modules/common/types'

defineProps({
  resumenCausa: propTypes.object,
  ruc: propTypes.string,
  isLoading: Boolean
})

const emit = defineEmits(['ver-info-fiscal'])

function verInformacionFiscal () {
  emit('ver-info-fiscal')
}
</script>

<style lang="scss" scoped>
#pjud {
  ::v-deep(.p-fieldset-legend) {
    background: transparent !important;
  }
}

#info-denuncia {
  ::v-deep(.p-fieldset-content) {
    width: 100%;
  }
}

::v-deep(.p-toggleable-content) {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  height: 100%;
  width: 100%;
}

.logo-pjud {
  max-height: 6rem;
}

li {
  list-style: none;
}
</style>
