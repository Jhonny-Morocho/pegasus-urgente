<template>
<section>
  <div class="grid pt-3 flex justify-content-between">
    <div class="col-12 md:col-5 ml-4">
      <h3 v-if="$hasSomeRoles(preclasificador.value)">
        Nombre Causa:
        <span>{{ }}</span>
      </h3>
      <h3 v-if="$hasSomeRoles(preclasificador.value)">
        Estado de la Causa: <span>{{}}</span>
      </h3>
      <h3>
        Fiscalía: <span>{{ user.fiscalias ? user.fiscalias[0].fiscalia : '' }}</span>
      </h3>
    </div>
    <div class="col-12 md:col-6 pb-0">
      <h3>
        Fiscal asignado: <span>
          <Button
            class="p-button-text p-0 btn-primary-outline"
            :label="user?.name"
            @click="openModalDetallesFiscalAsignado(data)"
          /></span>
      </h3>
    </div>
  </div>
</section>
</template>

<script setup>
import { propTypes } from '@/modules/common/types/prop.types'
import { computed, defineProps } from 'vue'
import { useAppDialog } from '@/modules/common/composables/useAppDialog'
import ModalDetallesFiscalAsignado from '@/modules/global/components/ficha-causa/modals/ModalDetallesFiscalAsignado.vue'
import { useSessionStore } from '@/modules/session/composables'

const { launchDialog } = useAppDialog()
const { user, perfiles } = useSessionStore()

const preclasificador = computed(() => perfiles.value[3].preclasificador)

function openModalDetallesFiscalAsignado () {
  launchDialog({
    component: ModalDetallesFiscalAsignado,
    header: 'Detalles Fiscal Asignado',
    accept: () => {
      console.log('accept')
    },
    reject: () => {
      console.log('reject')
    },
    width: '69%'
  })
}

defineProps({
  dataIdentificacionDenuncia: propTypes.array
})
</script>

<style scoped>
span {
  font-weight: 400;
}
h3 {
  margin-bottom: 1.2rem;
}
.hover:hover {
  background-color: lightgray;
}
</style>
