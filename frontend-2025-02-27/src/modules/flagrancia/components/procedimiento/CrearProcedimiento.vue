<template>
<div class="px-4 pb-4">
  <h3 class="mb-3 text-xl">
    {{ estadoProcedimiento }}
  </h3>
  <ProgressBar
    v-if="estadoProcedimiento === 'Creando Procedimiento'"
    mode="indeterminate"
    style="height: 0.5em"
  />
  <div v-else>
    <div class="grid px-3 text-xl justify-content-center">
      <div class="col-12 my-1">
        <span><strong>Folio: </strong></span>
        <span>{{ folio }}</span>
      </div>
      <div class="col-12 my-1">
        <span><strong>Fiscalía: </strong></span>
        <span>{{ fiscaliaLocal.nombre }}</span>
      </div>
      <div class="col-12 my-1">
        <span><strong>Fiscal de Turno: </strong></span>
        <span> {{ $hasSomeRoles([`zona_2_fiscalia_${$userFiscaliaActual.fiscalia}_fiscal_turno_TIN`])
          ? fiscaliaLocal?.fiscalDeTurno?.toUpperCase()
          : `Equipo Turno (${fiscaliaLocal.fiscalDeTurno.toUpperCase()})`
        }} </span>
      </div>
      <div class="col-12 my-1">
        <span><strong>Fecha y Hora: </strong></span>
        <span> {{ dateTimeUtil.formatToFrontendWithTime() }} </span>
      </div>
    </div>

    <div class="flex justify-content-center mt-4">
      <Button
        class="btn-form"
        icon-pos="right"
        label="Aceptar"
        style="min-width: 128px"
        @click="handleClose"
      />
    </div>
  </div>
</div>
</template>
<script setup>
import { ref, defineEmits, reactive } from 'vue'
import { useStepRegistroContactoStore } from '@/modules/flagrancia/composables'
import { useMantenedorStore } from '@/modules/global/composables'
import { useAppGlobalProperties } from '@/modules/common/composables'
import { dateTimeUtil } from '@/utils'

const { registroContacto, folio } = useStepRegistroContactoStore()
const { mantenedor_getNombreFiscaliaByCodigo } = useMantenedorStore()
const { $hasSomeRoles, $userFiscaliaActual } = useAppGlobalProperties()

const estadoProcedimiento = ref('Creando Procedimiento')

const fiscaliaLocal = reactive({
  nombre: mantenedor_getNombreFiscaliaByCodigo($userFiscaliaActual.value.fiscalia.toString()),
  fiscalDeTurno: registroContacto.value.nombreFiscalTurno
})

const emit = defineEmits([
  'crear-procedimiento:cerrar-modal'
])

function handleClose () {
  emit('crear-procedimiento:cerrar-modal')
}

setTimeout(() => {
  estadoProcedimiento.value = 'Procedimiento Creado'
}, 1500)
</script>
