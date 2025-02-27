<template>
<section>
  <main
    v-if="alerta"
    v-tooltip.top="'click ver +'"
    class="bg-yellow-100 chip"
  >
    <span
      v-if="isChipConModal"
      class="chip__content"
    >
      <Button
        class="p-button-link justify-content-center"
        @click="modalAlerta(alerta)"
      >
        {{ alerta?.tipo }}
      </Button>
    </span>

    <span
      v-else
      class="chip__content"
    >
      {{ alerta?.nombre }}
    </span>
  </main>
</section>
</template>
<script setup>
import { defineProps } from 'vue'
import { propTypes } from '@/modules/common/types'
import ModalAlerta from '@/modules/global/components/sujetos-intervinientes/modals/ModalAlerta.vue'
import { useAppDialog } from '@/modules/common/composables'
const { launchDialog } = useAppDialog()

defineProps({
  alerta: propTypes.object,
  isChipConModal: { type: Boolean, default: false }
})

function modalAlerta (data) {
  launchDialog({
    component: ModalAlerta,
    width: '40vw',
    props: { data },
    header: 'Alerta ' + data?.tipo,
    cancelLabel: 'Cerrar'
  })
}
</script>
<style lang="scss" scoped>
.chip {
    align-items: center;
    display: inline-flex;
    justify-content: center;
    border-radius: 9999px;
    padding: 0.1rem 0.1rem;
}

.chip__content {
    margin: 0.1rem;
    font-weight: bold;
}
</style>
