import { inject } from 'vue'

export const useAppDialog = () => {
  const emitter = inject('emitter')

  function launchDialog ({
    component,
    header,
    showHeader,
    width,
    confirmLabel,
    confirmLabel2,
    confirmIcon,
    confirmIconPos,
    cancelLabel,
    cancelIcon,
    cancelIconPos,
    props,
    accept,
    reject,
    ...config
  }) {
    emitter.emit('launch:dialog', { component, header, showHeader, width, confirmLabel, confirmLabel2, confirmIcon, confirmIconPos, cancelLabel, cancelIcon, cancelIconPos, props, accept, reject, ...config })
  }

  return {
    launchDialog
  }
}
