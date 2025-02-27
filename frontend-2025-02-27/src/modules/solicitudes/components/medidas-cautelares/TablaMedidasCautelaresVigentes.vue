<template>
<section class="col-12">
  <AppDataTable
    class="w-full"
    :loading="loader"
    :rows="paginacionRelacionesConMedidasSegundaTabla?.tamanoPagina"
    :total-records="
      paginacionRelacionesConMedidasSegundaTabla?.elementosTotales
    "
    :value="relacionesConMedidasSegundaTabla"
    @page="getMedidasCautelaresVigentes"
  >
    <Column :header="isIntrusiva ? 'Medida Intrusiva' : 'Medida Cautelar'">
      <template #body="{ data }">
        {{
          mantenedor_getDescripcionMedidasCautelaresById(data.idMedida) ??
            "Sin Información"
        }}
      </template>
    </Column>
    <Column header="Imputado">
      <template #body="{ data }">
        {{ data?.nombreCompletoImputado }}
      </template>
    </Column>
    <Column header="Descripción Medida Cautelar">
      <template #body="{ data }">
        {{ data?.descripcion }}
      </template>
    </Column>
  </AppDataTable>
</section>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue'

import {
  useMantenedorStore,
  useRelacionesStore
} from '@/modules/global/composables'
import { useAppToast } from '@/modules/common/composables'
import { requestUtil } from '@/utils'
import { useSolicitudesStore } from '../../composables'

const { toastError } = useAppToast()

const {
  relaciones_getRelacionesConMedidasCautelares,
  relacionesConMedidasSegundaTabla,
  paginacionRelacionesConMedidasSegundaTabla
} = useRelacionesStore()

const { idDenuncia, relacionesSeleccionadas } = useSolicitudesStore()

const {
  mantenedor_getTipoMedida,
  mantenedor_getEstadoMedidaHito,
  mantenedor_getDescripcionMedidasCautelaresById
} = useMantenedorStore()

defineProps({
  tieneAcciones: Boolean,
  isIntrusiva: Boolean
})

const loader = ref(false)
// const tipoMedidaId = ref(null)
const firstRecord = ref(0)

onMounted(() => {
  getMantenedor().then(() => {
    getMedidasCautelaresVigentes()
  })
})

const getMantenedor = () => {
  loader.value = true
  const promiseArray = []
  promiseArray.push(requestUtil({ action: mantenedor_getTipoMedida }))
  promiseArray.push(requestUtil({ action: mantenedor_getEstadoMedidaHito }))
  return Promise.all(promiseArray)
}

function getMedidasCautelaresVigentes (pagination = undefined) {
  loader.value = true
  // Atentos si cambia el campo código de tipoMedida y finalmente le colocan un número
  // tipoMedidaId.value = tipoMedida?.value.find(
  //   (m) => m.codigo === ''
  // ).id

  const idsRelacionesImputados = relacionesSeleccionadas.value.map(
    ({ idRelacionImputado }) => idRelacionImputado
  )

  if (!pagination) {
    firstRecord.value = 0
  }

  // console.log(tipoMedida?.value, tipoMedidaId.value)

  requestUtil({
    action: relaciones_getRelacionesConMedidasCautelares,
    payload: {
      params: {
        'id-denuncia': idDenuncia.value,
        'cod-tipo-medida': 'MEDIDAS_CAUTELAR',
        'cod-estados': 5, // 5 corresponde a VIGENTE
        'id-relaciones': idsRelacionesImputados.join(','), // acepta uno o varios ids separados por comas
        page: pagination?.page,
        size: pagination?.rows
      },
      esSegundaTabla: true
    },
    loader: (l) => {
      loader.value = l
    },
    reject: () =>
      toastError('Ocurrió un error al cargar la tabla Medida Cautelar Vigente')
  })
}
</script>
