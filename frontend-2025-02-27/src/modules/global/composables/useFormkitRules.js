import { useFormValidation } from '@/modules/common/composables'

export const useFormkitRules = (rules) => {
  const validation = useFormValidation()

  if (!rules) {
    console.warn('Parametro \'Rules\' es necesario para utilizar este composable')
    return null
  }

  const rulesObj = {}

  for (const rule of rules.ordinaryRules) {
    rulesObj[rule] = validation[rule]
  }

  if (rules.maxLength) {
    rulesObj.maxLength = validation.maxLength(rules.maxLength)
  }

  if (rules.minLength) {
    rulesObj.minLength = validation.minLength(rules.minLength)
  }

  return rulesObj
}
