import useVuelidate from '@vuelidate/core'
import { computed, getCurrentInstance, reactive, toRef, useAttrs, watch } from 'vue'
import { useFormValidation, useModelWrapper } from '.'
import { propTypes } from '../types/prop.types'

export const defaultValidationComponentProps = {
  id: {
    type: String,
    required: true
  },
  validationScope: propTypes.string,
  rules: propTypes.object,
  disabled: Boolean,
  showClear: Boolean,
  maxLength: {
    default: 255
  }
}

function getVuelidateScope (parentAppForm, props) {
  return parentAppForm ? { $scope: props.validationScope || parentAppForm.props.validationScope } : undefined
}

export const useValidationComponent = () => {
  const { parent, props } = getCurrentInstance()
  const { oneSpaceBetweenWords } = useFormValidation()

  let parentAppForm = parent
  let formSubmittedAppForm = false
  let formReadonly = false
  let formValidationDisabled = false

  // busca y valida que exista el component ancestro AppForm
  while (!formSubmittedAppForm) {
    if (parentAppForm?.type?.name === 'AppForm') {
      formSubmittedAppForm = toRef(parentAppForm.props, 'formSubmitted')
      formReadonly = toRef(parentAppForm.props, 'formReadonly')
      formValidationDisabled = toRef(parentAppForm.props, 'formValidationDisabled')

      if (formSubmittedAppForm.value === null) {
        throw new Error('Los componentes con validaciones necesitan estar dentro de un componente ancestro <AppForm> con la prop "formSubmitted" que se obtiene del composable useFormValidation')
      }

      break
    }
    parentAppForm = parentAppForm?.parent

    if (!parentAppForm) {
      //
      break
    }
  }

  /**
   * observa el estado de formValidationDisabled
   * y setea formSubmittedAppForm como falso
   * para deshabilitar la validación del scope del formulario
   */
  watch(
    () => formValidationDisabled.value,
    (newVal) => {
      if (newVal) {
        formSubmittedAppForm.value = false
      }
    }
  )

  // determina si coloca (*) cuando un campo tiene la regla required
  const showRequiredIndicator = computed(() => !formValidationDisabled.value && props.rules?.required)

  const model = useModelWrapper()

  const attrs = useAttrs()

  const vBind = computed(() => ({
    ...attrs,
    class: undefined,
    disabled: props.disabled || formReadonly.value
  }))

  const v$ = useVuelidate(
    computed(() => ({
      model: {
        // si se establece formValidationDisabled en false, no configurará reglas de validación
        ...(!formValidationDisabled.value && {
          ...props.rules,
          // si tiene la validación alfabetico incluirá la validación oneSpaceBetweenWords
          ...(props.rules?.alfabetico && !props.rules?.allowSpaces && { oneSpaceBetweenWords })
        }),
        $warn: props.id
      }
    })),
    reactive({
      model
    }),
    {
      $registerAs: props.id,
      ...getVuelidateScope(parentAppForm, props)
    }
  )

  return {
    v$,
    model,
    formSubmittedAppForm,
    formReadonly,
    vBind,
    showRequiredIndicator
  }
}
