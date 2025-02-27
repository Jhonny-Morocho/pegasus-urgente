<template>
<section class="my-6">
  <TablaHistorialAudiencias 
    :value="historialCausa"
  />
</section>
</template>

<script setup>
import TablaHistorialAudiencias from '@/modules/tramitar-audiencia/components/tables/TablaHistorialAudiencias.vue'
import defineProps from 'vue'
import { propTypes } from '@/modules/common/types'
import { useTramitarAudiencia } from '../../composables'
import { requestUtil } from '@/utils';
import { useAppToast } from '@/modules/common/composables';

const { toastError } = useAppToast()
const { historialCausa, tramitarAudiencia_getHistorialCausa } = useTramitarAudiencia()

const props = defineProps({
  idCausa: propTypes.string
})

function init(){
  const params = {
    page: `?page=0`,
    size: `&size=10`,
    order: `&order=ASC`
  }
  requestUtil({
    action: tramitarAudiencia_getHistorialCausa,
    payload: { 
      idCausa: props.idCausa,
      params: params
    },
    reject: () => { toastError('Error al cargar el historial de causas') },
  })
}

init()
</script>
