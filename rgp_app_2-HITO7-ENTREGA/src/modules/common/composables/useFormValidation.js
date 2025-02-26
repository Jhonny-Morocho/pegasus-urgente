import { ref } from 'vue'

import useVuelidate from '@vuelidate/core'

import { helpers, required, minLength, maxLength, email, numeric, maxValue, requiredUnless } from '@vuelidate/validators'

import { validate } from '@fiquu/cl-rut'

/* eslint-disable eqeqeq */
/**
 * composable para validar formulario y campos
 *
 * @param {Reactive Object} formData
 *
 */
export const useFormValidation = ({ formData = null, validationScope = null } = {}) => {
  // instancia vuelidate
  let vuelidate = false
  const inititalFormData = { ...formData }

  // para verificar si se hace submit del form
  const formSubmitted = ref(false)

  /**
   * checkea si el formulario es válido
   * @returns Boolean
   */
  function isFormValid () {
    formSubmitted.value = true
    setTimeout(() => {
      // hace scroll smooth donde encuentre el primer elemento con la clase p-invalid
      document.querySelector('.p-invalid')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }, 10)

    return !vuelidate.value.$invalid
  }

  function resetFormData () {
    Object.assign(formData, inititalFormData)
    formSubmitted.value = false
  }

  function resetByKeys (array) {
    for (const key of array) {
      if (formData[key]) {
        formData[key] = inititalFormData[key]
      }
    }
  }

  // si recibe formulario instancia vuelidate para comprobar si el form es válido
  if (formData) {
    vuelidate = useVuelidate(null, formData, { $scope: validationScope })
  }

  return {
    isFormValid,
    formSubmitted,
    resetFormData,
    resetByKeys,
    formData,
    isRutValid: (val) => validate(val),

    // rules
    required: helpers.withMessage('El campo es obligatorio', required),

    requiredUnless: (v) => helpers.withMessage(() => 'Debe completar al menos 1 campo', requiredUnless(v)),

    numeric: helpers.withMessage('El campo debe ser numérico', numeric),

    rutValid: helpers.withMessage('El RUT no es válido', (v) => validate(v)),

    alfabetico: helpers.withMessage('El campo debe tener caracteres alfabéticos', (v) => v == '' || /^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]*$/.test(v)),

    oneSpaceBetweenWords: helpers.withMessage('El campo debe tener solo un espacio entre palabras', (v) => v == '' || /^([a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]+\s)*[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]+$/.test(v)),

    minLength: (v) => helpers.withMessage(({ $params }) => `El campo debe tener más de ${$params.min} caracteres`, minLength(v)),

    maxLength: (v) => helpers.withMessage(({ $params }) => `El campo debe tener menos de ${$params.max} caracteres`, maxLength(v)),

    maxValue: (v) => helpers.withMessage(({ $params }) => `El valor no puede ser mayor que ${$params.max}`, maxValue(v)),

    email: helpers.withMessage(`No es un email válido`, email)
  }
}
