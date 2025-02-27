<template>
<div
  class="flex flex-column field"
  :class="[[$attrs.class]]"
>
  <span class="p-float-label">
    <Dropdown
      :id="id"
      v-model="v$.model.$model"
      class="p-inputtext-sm"
      :class="{ 'p-invalid': v$.model.$invalid && formSubmittedAppForm }"
      empty-filter-message="Sin resultados"
      :filter="vBind.options?.length > 4"
      :loading="loading"
      :show-clear="showClear && !!v$.model.$model"
      v-bind="vBind"
    />
    <label
      :class="{ 'text-error': v$.model.$invalid && formSubmittedAppForm }"
      :for="id"
    >
      {{ label
      }}<template v-if="showRequiredIndicator">(<span class="text-error">*</span>
        <span>)</span>
      </template>
    </label>

    <small
      v-if="
        (v$.model.$invalid && formSubmittedAppForm) ||
          v$.model.$pending.$response
      "
      class="p-error-message p-error"
    >
      <span>
        {{ v$.$silentErrors[0].$message }}
      </span>
    </small>
  </span>
</div>
</template>

<script>
import { defineComponent, ref, watch, computed } from 'vue'
import { requestUtil } from '@/utils'
import { isEmpty } from 'lodash'

import {
  useValidationComponent,
  defaultValidationComponentProps,
  useAppToast
} from '../../composables'

export default defineComponent({
  name: 'AppDropdown',

  inheritAttrs: false,

  props: {
    ...defaultValidationComponentProps,
    label: {
      type: String,
      required: true
    },
    retrieveDataAction: {
      type: Function,
      default: null
    },
    payload: {
      type: Object,
      default: null
    },
    modelValue: {
      type: [String, Number, Object],
      default: null
    }
  },

  setup: (props) => {
    const loading = ref(false)
    const { toastError } = useAppToast()

    const payload = computed(() => props.payload)

    function getData () {
      loading.value = true
      requestUtil({
        action: props.retrieveDataAction,
        payload: payload.value,
        loader: (l) => {
          loading.value = l
        },
        reject: () => {
          toastError(
            `El campo ${props.label} no pudo ser cargado con exitosamente`
          )
        }
      })
    }

    if (props.retrieveDataAction) {
      getData()
    }

    watch(payload, (newValue, oldValue) => {
      if (isEmpty(newValue)) return
      if (newValue !== oldValue) {
        getData()
      }
    })

    return { ...useValidationComponent(), loading }
  }
})
</script>

<style lang="scss" scoped>
.p-error-message {
  position: absolute;
}
.text-error {
  top: 50% !important;
}
</style>
