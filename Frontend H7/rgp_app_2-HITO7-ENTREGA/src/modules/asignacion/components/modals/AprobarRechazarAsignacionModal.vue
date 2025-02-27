<template>
<hr class="mb-4">
<div class="flex flex-column">
  <section
    v-if="isAprobado"
    class="flex justify-content-center align-items-center mb-3"
  >
    <i
      class="pi text-5xl mx-2"
      :class="isAltaComplejidad ? 'pi-check-circle text-green-500' : 'pi-exclamation-triangle text-yellow-500'"
    />
    <h1 class="font-normal text-xl mx-2">
      {{ isAltaComplejidad ? 'Se Enviará la Consulta a FR' : 'Se Concluirá Asignación de Causa' }}
    </h1>
  </section>
  <main class="mb-3">
    <ul>
      <li>
        <strong>RUC:</strong> {{ data?.ruc }}
      </li>
      <li>
        <strong>Número de Intervinientes:</strong> {{ data?.numeroIntervinientes }}
      </li>
      <li
        v-if="data?.complejidad"
        class="capitalize"
      >
        <strong>Complejidad:</strong> {{ data?.complejidad }}
      </li>
      <li v-if="isAprobado && isAltaComplejidad && textoFR">
        <strong>Consulta al Fiscal Regional:</strong>
      </li>
    </ul>
    <section
      v-if="isAprobado && isAltaComplejidad && textoFR"
      class="w-full mt-3"
    >
      <Editor
        id="consulta-fiscal"
        v-model="textoFR"
        class="w-full"
        editor-style="height: 256px"
        readonly
      />
    </section>
  </main>
  <AppForm
    v-if="!isAprobado"
    id="rechazar-asignacion-form"
    class="px-3"
    :form-submitted="formSubmitted"
    validation-scope="formRechazo"
  >
    <p class="pb-3">
      Ingrese el Motivo para Confirmar el Rechazo
    </p>
    <AppTextarea
      id="comentario-cierre"
      v-model="formData.motivo"
      auto-resize
      cols="127"
      label="Motivo del Rechazo"
      rows="6"
      :rules="{required}"
    />
  </AppForm>
</div>
</template>
<script setup>
import { defineProps, reactive, defineExpose, ref } from 'vue'
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { propTypes } from '@/modules/common/types'

const props = defineProps({
  isAprobado: Boolean,
  isConsulta: Boolean,
  isAltaComplejidad: Boolean,
  data: propTypes.object
})

const { toastError, TOAST_MESSAGES } = useAppToast()

const textoFR = ref(props?.data?.consultaFiscal)

const formData = reactive({
  motivo: null
})

const { formSubmitted, required, isFormValid } = useFormValidation({
  formData,
  validationScope: 'formRechazo'
})

function retrieveData (retrieveCb) {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  retrieveCb?.(formData)
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
