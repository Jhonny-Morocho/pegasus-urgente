import { useDialog } from 'primevue/usedialog'

export const useDynamicDialog = () => {
  const dialog = useDialog()

  function launchDynamicDialog ({ component, header, width, templates, onClose, props, data, style, ...config }) {
    return dialog.open(component, {
      data: {
        ...data
      },
      props: {
        header,
        modal: true,
        draggable: false,
        style: {
          width,
          ...style
        },
        ...props
      },
      templates,
      onClose: (modalData) => onClose?.(modalData),
      ...config
    })
  }

  return { launchDynamicDialog }
}
