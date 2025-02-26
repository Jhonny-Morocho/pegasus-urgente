import { inject, provide, reactive } from 'vue'
import { useFormValidation } from '@/modules/common/composables'

// scope de formulario
const relacionesValidationScope = 'relaciones'

export const useRelacionesProvide = () => {
  const relacion = reactive({
    idDetalleHechoDelictual: '',
    idDenuncia: '',
    idRelacionVictima: '',
    idPersonaVictima: '',
    idRelacionImputado: '',
    idPersonaImputado: ''
  })

  const relacionesProvide =
    useFormValidation({
      // formulario
      formData: reactive({
        ...relacion
      }),
      validationScope: relacionesValidationScope
    })

  provide(
    relacionesValidationScope,
    // instancia de useFormValidation del provider
    relacionesProvide
  )

  return {
    relacionesValidationScope,
    relacionesProvide
  }
}

export const useRelacionesInject = () => ({
  relacionesInject: inject(relacionesValidationScope),
  // instancia de la injección
  relacionesValidationScope
})
