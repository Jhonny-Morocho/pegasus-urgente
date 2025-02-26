<template>
<AppFieldset
  class="p-fluid w-full mt-4"
  legend="Antecedentes del documento"
>
  <section class="col-12 md:col-12 p-fluid">
    <div class="col-12">
      <strong> Nombre del Archivo: </strong>{{ props?.data?.nombre }}
    </div>

    <div class="col-12 p-fluid">
      <strong>Clase documental: </strong>{{ props?.data?.claseDocumental }}
    </div>

    <div class="grid pl-2 mt-2">
      <div class="col-9 resumen">
        <strong class="resumen"> Resumen: </strong>{{ props?.data?.resumen }}
      </div>
      <div class="col-3 py-4 pl-3">
        <Button
          class="p-button-sm p-button-outlined"
          icon="pi pi-file-o"
          label="Ver Detalle del Documento"
          @click="verDetalleDocumento()"
        />
      </div>
    </div>
  </section>
</AppFieldset>
</template>
<script setup>
import { defineProps } from 'vue'
import ModalDetalleDocumento from '@/modules/catalogo-documental-digital/components/common/modal/ModalDetalleDocumento.vue'
import { useAppDialog } from '@/modules/common/composables'
import { propTypes } from '@/modules/common/types'
const props = defineProps({
  data: propTypes.object
})
const { launchDialog } = useAppDialog()
function verDetalleDocumento () {
  launchDialog({
    component: ModalDetalleDocumento,
    header: 'Ver Detalle del Documento',
    width: '60%',
    props: { data: props.data },
    cancelLabel: 'Cerrar'
  })
}
</script>
<style scoped>
.resumen {
  overflow: auto;
}
</style>
