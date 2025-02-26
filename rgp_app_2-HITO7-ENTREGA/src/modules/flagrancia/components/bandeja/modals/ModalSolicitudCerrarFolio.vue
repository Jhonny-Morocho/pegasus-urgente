<template>
<section>
  <hr class="">
  <div class="grid col-12 mt-4">
    <div class="grid col-12 md:col-6 pl-4">
      <span class="col-12 my-2"><strong>
        Fiscal / Turno : </strong>{{ procedimiento.fiscalTurno }}
      </span>
      <span class="col-12 my-2"><strong>
        Procedimiento: </strong>Folio {{ procedimiento.folio }}
      </span>
    </div>
    <div class="grid col-12 md:col-6 pl-4">
      <span class="col-12 my-2"><strong>
        Fecha / hora solicitud: </strong>{{ formatFecha( new Date()) }}
      </span>
      <span class="col-12 my-2"><strong>
        Funcionario Responsable: </strong>{{ }}
      </span>
    </div>
    <div class="col-12 grid mt-4">
      <AppTextarea
        id="comentario-cierre"
        v-model="comentarioCierre"
        auto-resize
        cols="127"
        label="Ingrese un comentario"
        rows="6"
        :rules="{required}"
      />
    </div>
  </div>
</section>
</template>

<script setup>
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { propTypes } from '@/modules/common/types/prop.types'
import { dateTimeUtil } from '@/utils'
import { defineProps, defineExpose, ref } from 'vue'

const { toastError } = useAppToast()

const comentarioCierre = ref('')

defineProps({
  procedimiento: propTypes.object
})

const { required } = useFormValidation()

function formatFecha (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
}

function retrieveData (retrieveCb) {
  if (!comentarioCierre.value) {
    toastError('Debes agregar un comentario para cerrar el folio')
    return
  }

  retrieveCb?.({ comentarioCierre: comentarioCierre.value })
}

defineExpose({ retrieveData })

</script>
<style lang="scss" scoped>
ul {
  list-style: none;
  padding-left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
li {
  font-size: 1.2rem;
}
</style>
