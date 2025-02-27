<template>
<section
  v-if="dataUnidadPolicial?.isLoading"
  class="w-full px-4 py-5"
>
  <LoaderSkeleton
    class="w-full"
    height="10vh"
  />
</section>

<section
  v-else
  class="grid px-3 text-xl"
>
  <div class="col-6">
    <div class="col-12 my-1">
      <span><strong>Región: </strong></span>
      <span>{{ dataUnidadPolicial?.region ?? 'No Informado' }}</span>
    </div>
    <div class="col-12 my-1">
      <span><strong>Comuna: </strong></span>
      <span>{{ dataUnidadPolicial?.comuna ?? 'No Informado' }}</span>
    </div>
    <div class="col-12 my-1">
      <span><strong>Calle: </strong></span>
      <span> {{ dataUnidadPolicial?.calle ?? 'No Informado' }} </span>
    </div>
  </div>
  <div class="col-6">
    <div class="col-12 my-1">
      <span><strong>Número: </strong></span>
      <span> {{ dataUnidadPolicial?.numero ?? 'No Informado' }} </span>
    </div>
    <div class="col-12 my-1">
      <span><strong>Teléfono: </strong></span>
      <span> {{ dataUnidadPolicial?.telefono ?? 'No Informado' }} </span>
    </div>
    <div class="col-12 my-1">
      <span><strong>Correo: </strong></span>
      <span> {{ dataUnidadPolicial?.correo ?? 'No Informado' }} </span>
    </div>
  </div>
</section>
</template>

<script setup>
import { defineProps, reactive } from 'vue'

import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

import { requestUtil } from '@/utils'
import { propTypes } from '@/modules/common/types/prop.types'
import { useDireccionStore } from '@/modules/direccion/composables'
import { useAppToast } from '@/modules/common/composables'

const { toastError } =
  useAppToast()

const { direccion_getDireccionOrganismoColaborador } = useDireccionStore()

const props = defineProps({
  idOrganismoColaborador: propTypes.string
})

const dataUnidadPolicial = reactive({
  isLoading: false,
  region: null,
  comuna: null,
  calle: null,
  numero: null,
  telefono: null,
  correo: null
})
function getDireccionOrganismoColaborador () {
  if (!props.idOrganismoColaborador) return
  requestUtil({
    action: direccion_getDireccionOrganismoColaborador,
    payload: {
      idOrganismoColaborador: props.idOrganismoColaborador
    },
    loader: (l) => { dataUnidadPolicial.isLoading = l },
    resolve: ({ direccion }) => {
      dataUnidadPolicial.calle = direccion?.calle
      dataUnidadPolicial.numero = direccion?.numero
      dataUnidadPolicial.comuna = direccion?.comuna
      dataUnidadPolicial.region = direccion?.region
      dataUnidadPolicial.telefono = direccion?.telefono
      dataUnidadPolicial.correo = direccion?.correo
    },
        reject: () => toastError('Ocurrio un error al cargar la dirección')
  })
}
getDireccionOrganismoColaborador()

</script>
