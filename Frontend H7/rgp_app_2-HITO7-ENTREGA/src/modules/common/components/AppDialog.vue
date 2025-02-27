<template>
<Dialog
  v-model:visible="displayModal"
  :breakpoints="{ '960px': '75vw' }"
  class="app-dialog"
  :closable="dynamicClosable"
  :dismissable-mask="false"
  :draggable="false"
  :header="dynamicHeader || ' '"
  :modal="true"
  :show-header="dynamicShowHeader"
  :style="{ width: dynamicWidth || '50vw' }"
  @hide="closeModal"
>
  <Component
    :is="dynamicComponent"
    ref="DynamicComponent"
    class="mt-2"
    v-bind="dynamicProps"
    @data="sendData"
  />
  <template #footer>
    <Button
      v-if="dynamicCancelLabel !== 'hideCancelLabel'"
      class="p-button-text"
      :icon="dynamicCancelIcon"
      :icon-pos="dynamicCancelIconPos || 'left'"
      :label="dynamicCancelLabel || 'Cancelar'"
      @click="closeModal"
    />
    <Button
      v-if="dynamicConfirmLabel"
      :icon="dynamicConfirmIcon"
      :icon-pos="dynamicConfirmIconPos || 'left'"
      :label="dynamicConfirmLabel"
      @click="handleConfirm"
    />
  </template>
</Dialog>
</template>

<script setup>
import { ref, inject, markRaw, onBeforeUnmount } from 'vue'

const emitter = inject('emitter')

const displayModal = ref(false)
const dynamicComponent = ref(undefined)
const dynamicProps = ref(undefined)
const dynamicAccept = ref(undefined)
const dynamicReject = ref(undefined)
const dynamicHeader = ref('')
const dynamicWidth = ref('')
const dynamicConfirmLabel = ref('')
const dynamicCancelLabel = ref('')
const dynamicShowHeader = ref(true)
const dynamicCancelIcon = ref('')
const dynamicCancelIconPos = ref('')
const dynamicConfirmIcon = ref('')
const dynamicConfirmIconPos = ref('')
const dynamicClosable = ref(true)

const DynamicComponent = ref(null)

emitter.on(
  'launch:dialog',
  ({ component, header, showHeader, width, confirmLabel, confirmIcon = 'pi pi-check', confirmIconPos, cancelLabel, cancelIcon = 'pi pi-times', cancelIconPos, props, accept, reject, closable  }) => {
    dynamicHeader.value = header
    dynamicShowHeader.value = showHeader
    dynamicWidth.value = width
    dynamicConfirmLabel.value = confirmLabel
    dynamicConfirmIcon.value = confirmIcon
    dynamicConfirmIconPos.value = confirmIconPos
    dynamicCancelLabel.value = cancelLabel
    dynamicCancelIcon.value = cancelIcon
    dynamicCancelIconPos.value = cancelIconPos
    dynamicClosable.value = closable

    dynamicProps.value = props

    dynamicAccept.value = (data) => {
      accept?.(data)
    }
    dynamicReject.value = () => {
      reject?.()
    }

    dynamicComponent.value = markRaw(component)

    displayModal.value = true
  }
)

function sendData (data) {
  displayModal.value = false

  dynamicAccept.value?.(data)
}

function handleConfirm () {
  if (DynamicComponent.value.retrieveData) {
    DynamicComponent.value.retrieveData((data) => sendData(data))
  } else {
    sendData(undefined)
  }
}

function closeModal () {
  displayModal.value = false

  dynamicReject.value?.()
}

onBeforeUnmount(() => {
  emitter.off('launch:dialog')
})
</script>

  <style lang="scss">
  .app-dialog {
    .p-dialog-footer {
      padding-right: 0.75rem;
      padding-bottom: 1.5rem;
    }
  }
  .p-dialog{
    z-index: 1101 !important;
  }
  </style>
