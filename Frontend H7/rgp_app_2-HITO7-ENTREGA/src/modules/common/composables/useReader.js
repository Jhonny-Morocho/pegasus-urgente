import { ref } from 'vue'

export const useReader = (file) => {
  const fileBase64 = ref('')
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    fileBase64.value = reader.result.split(',')[1]
  }
  reader.onerror = () => {
    fileBase64.value = null
  }

  return {
    fileBase64
  }
}
