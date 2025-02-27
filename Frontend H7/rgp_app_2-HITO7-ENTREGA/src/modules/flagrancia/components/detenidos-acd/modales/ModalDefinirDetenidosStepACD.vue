<template>
<AppForm
  id="modificar-detenido"
  :form-submitted="formSubmitted"
  :loading="loader"
  validation-scope="formData"
>
  <div class="grid">
    <AppDropdown
      id="idDecisionAcd"
      v-model="formData.idDecisionAcd"
      class="col-12 md:col-3"
      :disabled="loader"
      filter
      label="Pasar ACD"
      :loading="loader"
      :options="['ACD', 'Apercibido', 'Pendiente']"
      show-clear
    />

    <template v-if="isselectedACD">
      <AppDropdown
        id="idJuzgado"
        v-model="formData.idJuzgado"
        class="col-12 md:col-3"
        label="Juzgado"
        :loading="loader"
        option-label="descripcion"
        option-value="id"
        :options="juzgados"
        :retrieve-data-action="mantenedor_getjuzgados"
        show-clear
      />

      <AppCalendar
        id="fechaPresentacionAcd"
        v-model="formData.fechaPresentacionAcd"
        class="col-12 md:col-3"
        label="Fecha de presentación a ACD"
        :max-date="new Date('2100-12-31')"
        :min-date="new Date()"
      />

      <AppDropdown
        id="idBloqueHorarioPresentacionAcd"
        v-model="formData.idBloqueHorarioPresentacionAcd"
        class="col-12 md:col-3"
        label="Bloque"
        :loading="loader"
        :options="[
          'Sala 1 - Bloque AM', 'Sala 1 - Bloque PM', 'Sala 2 - Bloque AM', 'Sala 2 - Bloque PM', 'Sala 3 - Bloque AM', 'Sala 3 - Bloque PM'
        ]"
        show-clear
      />
    </template>
  </div>
  <div class="grid">
    <AppTextarea
      id="comentarioAcd"
      v-model="formData.comentarioAcd"
      class="col-12"
      :disabled="loader"
      label="Comentario"
      rows="5"
    />
  </div>
</AppForm>
</template>

<script setup>
import { defineProps, defineExpose, reactive, computed, onMounted, ref } from 'vue'

import { propTypes } from '@/modules/common/types/prop.types'
import { requestUtil } from '@/utils'
import { useStepDetenidosACDStore } from '@/modules/flagrancia/composables/index'
import { useFormValidation } from '@/modules/common/composables'
import { useMantenedorStore } from '@/modules/global/composables'
const { stepDetenidosACD_getDecisionACD } = useStepDetenidosACDStore()

const { juzgados, mantenedor_getjuzgados } = useMantenedorStore()

const props = defineProps({
  detenido: propTypes.object
})

const formData = reactive({
  idDecisionAcd: '',
  idBloqueHorarioPresentacionAcd: '',
  idJuzgado: '',
  comentarioAcd: '',
  fechaPresentacionAcd: ''
})
const loader = ref(false)
const isselectedACD = computed(() => formData.idDecisionAcd === 'ACD')

onMounted(() => {
  if (props.detenido.idProcedimientoDetenido) getDecisionACDSujeto()
})

function getDecisionACDSujeto () {
  loader.value = true
  requestUtil({
    action: stepDetenidosACD_getDecisionACD,
    payload: {
      idProcedimientoDetenido: props.detenido.idProcedimientoDetenido
    },
    resolve: (d) => {
      populateData({
        ...d
      })
    },
    loader: (l) => { loader.value = l }
  })
}

const { formSubmitted } = useFormValidation({ formData, validationScope: 'formData' })

function populateData (data) {
  Object.assign(formData, data)
}

function retrieveData (retrieveCb) {
  const { idDecisionAcd, idJuzgado, fechaPresentacionAcd, idBloqueHorarioPresentacionAcd, comentarioAcd } = formData
  retrieveCb?.({
    idDecisionAcd,
    idJuzgado,
    idBloqueHorarioPresentacionAcd,
    comentarioAcd,
    fechaPresentacionAcd,
    idProcedimientoDetenido: props.detenido?.idProcedimientoDetenido || null,
    idTipoDelito: props.detenido?.idTipoDelito,
    descripcionTipoDelito: props.detenido?.descripcionTipoDelito
  })
}

defineExpose({ retrieveData })
</script>
