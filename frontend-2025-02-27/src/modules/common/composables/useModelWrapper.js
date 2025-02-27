import { computed, getCurrentInstance } from 'vue'

export function useModelWrapper (name = 'modelValue') {
  const i = getCurrentInstance()

  return computed({
    get: () => i.props[name],
    set: (value) => i.emit(`update:${name}`, value)
  })
}
