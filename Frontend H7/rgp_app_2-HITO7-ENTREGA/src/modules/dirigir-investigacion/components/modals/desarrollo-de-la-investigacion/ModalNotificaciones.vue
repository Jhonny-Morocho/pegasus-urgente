<template>
<div>
  <AppFieldset
    class="w-full"
    legend="Alertas y Notificaciones"
  >
    <div class="col-12">
      <Message
        v-for="alerta in alertasNotificaciones"
        :key="alerta"
        class="mb-2 w-full"
        :closable="false"
        icon="pi pi-fw pi-exclamation-triangle"
        severity="error"
      >
        {{ alerta.detalle }}
      </Message>
    </div>
  </AppFieldset>
</div>
</template>

<script setup>
import { ref, defineProps, onMounted } from 'vue'
import { propTypes } from '@/modules/common/types/prop.types.js'
import { requestUtil } from '@/utils/request.util.js'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables/useDirigirInvestigacionStore.js'

const props = defineProps({
  ruc: propTypes.string
})

const alertasNotificaciones = ref([])

const { dirigirInvestigacion_getAlertasNotificacionesCausa } = useDirigirInvestigacionStore()

function getAlertasNotificaciones () {
  requestUtil({
    action: dirigirInvestigacion_getAlertasNotificacionesCausa,
    payload: {
      ruc: props?.ruc
    },
    resolve: (data) => {
      alertasNotificaciones.value = data
    }
  })
}

onMounted(() => {
  getAlertasNotificaciones()
})
</script>
