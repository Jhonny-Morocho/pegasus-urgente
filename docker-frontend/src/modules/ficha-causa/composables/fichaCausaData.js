import { reactive } from 'vue'
import { requestUtil } from '@/utils'
import {
  useAnotacionCausaStore,
  useDelitoStore,
  useEspeciesDineroStore,
  useMantenedorStore,
  useRelacionesStore,
  useRelatoStore,
  useSujetosIntervinientesStore,
  useAntecedentesCausaStore,
  useActividadStore
} from '@/modules/global/composables'
import { useFichaCausaStore } from './fichaCausaStore'

const sujetosIntervinientes = reactive({
  isLoading: false,
  first: 0,
  data: [],
  paginacion: null
})

const sujetosDenunciantes = reactive({
  isLoading: false,
  first: 0,
  data: [],
  paginacion: null
})

const delitos = reactive({
  isLoading: false,
  first: 0,
  data: [],
  paginacion: null
})

const relaciones = reactive({
  isLoading: false,
  first: 0,
  data: [],
  paginacion: null
})

const relato = reactive({
  isLoading: false,
  data: ''
})

const especies = reactive({
  isLoading: false,
  first: 0,
  data: [],
  paginacion: null
})

const diligencias = reactive({
  isLoading: false,
  first: 0,
  data: [],
  paginacion: null
})

const anotaciones = reactive({
  isLoading: false,
  first: 0,
  data: [],
  paginacion: null
})

const antecedentes = reactive({
  isLoading: false,
  data: []
})

const cantidad = reactive({
  diligencias: 0,
  especies: 0,
  sujetos: 0,
  delitos: 0,
  relaciones: 0,
  documentos: 0
})

const resumenCausa = reactive({
  isLoading: false,
  data: null
})

export function useFichaCausaData () {
  const { idDenuncia, ruc, idCausa, fichaCausa_getResumenCausa } = useFichaCausaStore()
  const { sujetosIntervinientes_getSujetosByIdGlobal } = useSujetosIntervinientesStore()
  const { delito_getDelitoByIdDenuncia } = useDelitoStore()
  const { antecedentesCausa_getAntecedentesCausa } = useAntecedentesCausaStore()
  const { relaciones_getRelaciones } = useRelacionesStore()
  const { relato_getRelatoByIdDenuncia } = useRelatoStore()
  const { especiesDinero_getEspecieByIdDenuncia } = useEspeciesDineroStore()
  const { actividad_getActividades } = useActividadStore()
  const { anotacionCausa_getAnotacionesByIdDenuncia } = useAnotacionCausaStore()
  const { mantenedor_getIdTipoSujetoByCodigo } = useMantenedorStore()

  function getResumenCausa () {
    requestUtil({
      action: fichaCausa_getResumenCausa,
      payload: {
        ruc: ruc.value
      },
      loader: (l) => { resumenCausa.isLoading = l },
      resolve: (data) => {
        resumenCausa.data = data
      }
    })
  }

  function getSujetosIntervientes (pagination = undefined) {
    if (!pagination) {
      sujetosIntervinientes.first = 0
    }
    const params = {
      page: pagination?.page || 0,
      size: pagination?.rows || 5
    }

    requestUtil({
      action: sujetosIntervinientes_getSujetosByIdGlobal,
      payload: {
        idDenuncia: idDenuncia.value,
        params
      },
      loader: (l) => {
        sujetosIntervinientes.isLoading = l
      },
      resolve: ({ data, paginacion }) => {
        sujetosIntervinientes.data = data
        sujetosIntervinientes.paginacion = paginacion
        cantidad.sujetos = paginacion?.elementosTotales
      }
    })
  }

  // SE DEBE MODIFICAR EL ENDPOINT DE SUJETOS PARA OBTENER LOS SUJETOS POR SU TIPO
  function getSujetosDenunciantes (pagination = undefined) {
    if (!pagination) {
      sujetosDenunciantes.first = 0
    }
    const params = {
      page: pagination?.page || 0,
      size: pagination?.rows || 5
    }

    requestUtil({
      action: sujetosIntervinientes_getSujetosByIdGlobal,
      payload: {
        idDenuncia: idDenuncia.value,
        params
      },
      loader: (l) => {
        sujetosDenunciantes.isLoading = l
      },
      resolve: ({ data, paginacion }) => {
        const idTipoDenunciante = mantenedor_getIdTipoSujetoByCodigo('1') // CODIGO 1: DENUNCIANTE
        sujetosDenunciantes.data = data.filter((d) => d.tipoSujeto === idTipoDenunciante)
        sujetosDenunciantes.paginacion = paginacion
      }
    })
  }

  function getDelitos (pagination = undefined) {
    if (!pagination) {
      delitos.first = 0
    }

    const params = {
      page: pagination?.page || 0,
      size: pagination?.rows || 5
    }

    requestUtil({
      action: delito_getDelitoByIdDenuncia,
      payload: {
        idDenuncia: idDenuncia.value,
        params
      },
      loader: (l) => {
        delitos.isLoading = l
      },
      resolve: ({ data, paginacion }) => {
        delitos.data = data
        delitos.paginacion = paginacion
        cantidad.delitos = paginacion?.elementosTotales
      }
    })
  }

  // SE DEBE MODIFICAR EL ENDPOINT DE RELACIONES PARA QUE TENGA PAGINACION
  function getRelaciones (pagination = undefined) {
    if (!pagination) {
      relaciones.first = 0
    }

    const params = {
      page: pagination?.page || 0,
      size: pagination?.rows || 5
    }

    requestUtil({
      action: relaciones_getRelaciones,
      payload: {
        idDenuncia: idDenuncia.value,
        params
      },
      loader: (l) => {
        relaciones.isLoading = l
      },
      resolve: ({ data }) => {
        relaciones.data = data
        relaciones.paginacion = {
          tamanoPagina: data?.length < 5 ? 5 : data?.length,
          elementosTotales: data?.length
        }
        cantidad.relaciones = data?.length || 0
      }
    })
  }

  function getRelato () {
    requestUtil({
      action: relato_getRelatoByIdDenuncia,
      payload: {
        idDenuncia: idDenuncia.value
      },
      loader: (l) => {
        relato.isLoading = l
      },
      resolve: ({ data }) => {
        relato.data = data?.descripcionRelato
      }
    })
  }

  // SE DEBE MODIFICAR EL ENDPOINT DE ESPECIES PARA QUE TENGA PAGINACION Y BUSQUEDA
  function getEspeciesDinero (pagination = undefined) {
    if (!pagination) {
      especies.first = 0
    }

    const params = {
      page: pagination?.page || 0,
      size: pagination?.rows || 5
    }

    requestUtil({
      action: especiesDinero_getEspecieByIdDenuncia,
      payload: {
        idDenuncia: idDenuncia.value,
        params
      },
      resolve: (data) => {
        especies.data = data
        especies.paginacion = {
          tamanoPagina: data?.length < 5 ? 5 : data?.length,
          elementosTotales: data?.length
        }
        cantidad.especies = data?.length || 0
      },
      loader: (l) => {
        especies.isLoading = l
      }
    })
  }

  // SE DEBE MODIFICAR EL ENDPOINT DE DILIGENCIAS PARA QUE TENGA PAGINACION Y BUSQUEDA
  function getDiligencias (pagination = undefined) {
    if (!pagination) {
      diligencias.first = 0
    }

    const params = {
      'id-origen-actividad': idCausa.value,
      'cod-tipo-actividad': '26', // CODIGO 26: DILIGENCIAS
      'cod-estados': '1,7,3,8', // 1: EN_PREPARACION, 7: INGRESADA, 3: APROBADA, 8: CUMPLIDA
      page: pagination?.page || 0,
      size: pagination?.rows || 5
    }

    requestUtil({
      action: actividad_getActividades,
      payload: { params },
      loader: (l) => {
        diligencias.isLoading = l
      },
      resolve: ({ data, paginacion }) => {
        diligencias.data = data
        diligencias.paginacion = paginacion
        cantidad.diligencias = paginacion?.elementosTotales
      }
    })
  }

  // SE DEBE MODIFICAR EL ENDPOINT DE ANOTACIONES PARA QUE TENGA BUSQUEDA
  function getAnotaciones (pagination = undefined) {
    if (!pagination) {
      anotaciones.first = 0
    }

    const params = {
      page: pagination?.page || 0,
      size: pagination?.rows || 5
    }

    requestUtil({
      action: anotacionCausa_getAnotacionesByIdDenuncia,
      payload: {
        idDenuncia: idDenuncia.value,
        params
      },
      loader: (l) => {
        anotaciones.isLoading = l
      },
      resolve: ({ data, paginacion }) => {
        anotaciones.data = data
        anotaciones.paginacion = paginacion
      }
    })
  }

  function getAntecedentesCausa () {
    requestUtil({
      action: antecedentesCausa_getAntecedentesCausa,
      payload: { ruc: ruc.value },
      loader: (l) => {
        antecedentes.isLoading = l
      },
      resolve: (data) => {
        antecedentes.data = data
      }
    })
  }
  return {
    sujetosIntervinientes,
    sujetosDenunciantes,
    delitos,
    relaciones,
    relato,
    especies,
    diligencias,
    anotaciones,
    cantidad,
    antecedentes,
    resumenCausa,
    getSujetosIntervientes,
    getSujetosDenunciantes,
    getDelitos,
    getRelaciones,
    getRelato,
    getEspeciesDinero,
    getDiligencias,
    getAnotaciones,
    getAntecedentesCausa,
    getResumenCausa
  }
}
