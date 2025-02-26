<template>
<section>
  <AppBtnsSteps no-button-back />
  <div>
    <PageHeader
      :items-menu-superior="itemsMenuSuperior"
      label-new="Validar Duplicidad"
      :lista-opciones-acciones="listaOpcionesAcciones"
      :page-title="'Validar Duplicidad'"
      validar-duplicidad-oficio
      @action:export="exportTable($event)"
    />

    <span><strong>Atención:</strong> En caso de encontrar una causa duplicada,
      según los criterios de búsqueda, debe seleccionarla y Confirmar
      Duplicidad. En caso contrario, seleccionar “Generar Denuncia".</span>

    <div v-if="loading || loadingGenerarDenuncia">
      <LoaderSkeleton />
    </div>
    <div v-else>
      <div class="grid">
        <div class="col-12">
          <CriteriosDeBusquedaDuplicidad
            :criterios-busqueda="criteriosBusqueda"
          />
        </div>
      </div>
      <AppFieldset
        class="mb-6"
        legend="Causas Candidatas a Duplicidad"
      >
        <TablaCandidatasDuplicidad ref="tablaCausasCandidatas" />
      </AppFieldset>

      <AppBtnNextTeleported
        v-if="tablaCausasCandidatas?.candidataSeleccionada"
        class="mr-3"
        label="Confirmar Duplicidad"
        @click="handleConfirmarCausaDuplicada"
      />
    </div>

    <AppBtnNextTeleported
      label="Generar Denuncia"
      :loading="loadingGenerarDenuncia"
      @click="handleNextStep"
    />
  </div>
</section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { requestUtil, dateTimeUtil } from '@/utils'
import {
  useAppToast,
  useConfirmDialog,
  useAppDialog
} from '@/modules/common/composables'
import {
  useDelitoStore,
  useEspeciesDineroStore,
  usePamStore,
  useRelacionesStore,
  useRelatoStore,
  useMantenedorStore,
  useSujetosIntervinientesStore
} from '@/modules/global/composables'
import {
  useIdentificacionDenunciaStore,
  useCrearCausaStore
} from '@/modules/ingreso/composables'
import { useAppGlobalProperties } from '@/modules/common/composables/useAppGlobalProperties'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

// Tablas
import TablaSujetos from '@/modules/global/components/sujetos-intervinientes/tablas/TablaSujetos.vue'
import TablaDelitos from '@/modules/global/components/delitos/TablaDelitos.vue'
import TablaRelaciones from '@/modules/global/components/relaciones/TablaRelaciones.vue'
import TablaEspeciesDinero from '@/modules/global/components/especies-dinero/TablaEspeciesDinero.vue'
import ModalRelato from '@/modules/ingreso/componentes/validar-duplicidad/ModalRelato.vue'
import TablaDocumentos from '@/modules/global/components/documentos/TablaDocumentos.vue'

import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import CriteriosDeBusquedaDuplicidad from '@/modules/global/components/buscar-duplicidad/CriteriosDeBusquedaDuplicidad.vue'
import ModalGenerarDenuncia from '@/modules/ingreso/componentes/documentos/ModalGenerarDenuncia.vue'

import { useFichaCausa } from '@/modules/ficha-causa/composables'

const {
  crearCausa_crearCausaOficio_Fisica,
  datosCompletosCausa,
  ruc,
  idCausa,
  idDenuncia
} = useCrearCausaStore()

const { identificacionDenuncia, tipoDenunciaObject } =
  useIdentificacionDenunciaStore()
const {
  sujetosIntervinientes, sujetosIntervinientes_getSujetosByIdGlobal
} = useSujetosIntervinientesStore()
const { delitos, delito_getDelitoByIdDenuncia } = useDelitoStore()
const { especies: especiesData, especiesDinero_getEspecieByIdDenuncia } = useEspeciesDineroStore()
const { relaciones, relaciones_getRelaciones } = useRelacionesStore()
const { relato, relato_getRelatoByIdDenuncia } = useRelatoStore()

const loaderState = reactive({
  loadingSujetos: false,
  loadingRegiones: false,
  loadingComunas: false
})

const loading = computed(() => {
  const {
    loadingSujetos,
    loadingRegiones,
    loadingComunas
  } = loaderState

  return loadingSujetos || loadingRegiones || loadingComunas
})

const {
  mantenedor_getNombreTipoSujeto,
  mantenedor_getTiposSujetos,
  mantenedor_getDescripcionRegionById,
  mantenedor_getDescripcionComunasById,
  mantenedor_getRegiones,
  mantenedor_getComunas
} = useMantenedorStore()

const { $userSub, $userFiscaliaActual, $userPrincipalRole, $userName } =
  useAppGlobalProperties()
const { toastError, toastSuccess, toastWarning } = useAppToast()
const { launchConfirmDialog } = useConfirmDialog()

const { procesoPam } = usePamStore()
const { launchDialog } = useAppDialog()

const tablaCausasCandidatas = ref(null)
const criteriosBusqueda = ref(null)
const loadingGenerarDenuncia = ref(false)
const dialogBuscandoDuplicidad = ref(false)

onMounted(async () => {
  await requestUtil({
    action: mantenedor_getTiposSujetos,
    loader: (l) => { loaderState.loadingSujetos = l }
  })

  await requestUtil({
    action: mantenedor_getRegiones,
    loader: (l) => { loaderState.loadingRegiones = l }
  })

  await requestUtil({
    action: mantenedor_getComunas,
    loader: (l) => { loaderState.loadingComunas = l }
  })

  validarDuplicidad()
})

function getInterviniente (intervinientes, tipoInterviniente, denunciante) {
  const interviniente =
    intervinientes?.filter(
      (el) => {
        return mantenedor_getNombreTipoSujeto(el.tipoSujeto) === tipoInterviniente ||
        (mantenedor_getNombreTipoSujeto(el.tipoSujeto) === denunciante &&
          el.esVictima)
      }) ?? null

  return interviniente
}

function getNombreInterviniente (interviniente) {
  if (!interviniente) {
    return ''
  }
  return interviniente?.map((s) =>
    `${s.nombres} ${s.apellidoPaterno} ${s.apellidoMaterno}`
      .trim()
      .toUpperCase()
  )
}

function getNumeroIdentificacion (interviniente) {
  return interviniente?.map((s) => s.numeroDocumento)
}

function getNombreDelito (delitosCausa) {
  return delitosCausa?.map((d) => d?.delito?.idTipoDelito?.toUpperCase())
}

function getDireccionDelito (delitosCausa) {
  return delitosCausa?.map((d) => {
    if (d.direccionDelito) {
      return `${mantenedor_getDescripcionRegionById(
        d.direccionDelito?.region
      )}, ${mantenedor_getDescripcionComunasById(d.direccionDelito?.comuna)}, ${
        d.direccionDelito?.calle
      }`
        .trim()
        .toUpperCase()
    } else return null
  })
}

function validarDuplicidad () {
  const { intervinientes, identificacion } = datosCompletosCausa.value
  const denunciante = getInterviniente(intervinientes, 'DENUNCIANTE')
  const victima = getInterviniente(intervinientes, 'VICTIMA', 'DENUNCIANTE')
  const imputado = getInterviniente(intervinientes, 'IMPUTADO')

  const nombreCompletoDenunciante = getNombreInterviniente(denunciante)
  const nombreCompletoVictima = getNombreInterviniente(victima)
  const nombreCompletoImputado = getNombreInterviniente(imputado)

  const nombreDelito = getNombreDelito(datosCompletosCausa.value.delitos)
  const direccionDelito = getDireccionDelito(datosCompletosCausa.value.delitos)
  const formDataBuscarDuplicidad = {
    // tipoDocumentoDenunciante: denunciante?.tipoDocumento) ?? '',
    rutDenunciante: getNumeroIdentificacion(denunciante),
    nombreDenunciante: nombreCompletoDenunciante[0],

    // tipoDocumentoVictima: victima?.tipoDocumento) ?? '',
    rutVictima: getNumeroIdentificacion(victima),
    nombreVictima: nombreCompletoVictima[0],

    // tipoDocumentoImputado: imputado?.tipoDocumento) ?? '',
    rutImputado: getNumeroIdentificacion(imputado),
    nombreImputado: nombreCompletoImputado[0],

    numeroDenuncia: delitos?.value[0]?.numeroDenuncia ?? '',
    fechaDenuncia: dateTimeUtil.formatToBackendWithTime(identificacion?.fechaDenuncia),
    unidadPolicial: identificacion?.idOrganismoColaboradorUnidad ?? '',

    delito: nombreDelito[0],
    fechaHoraDelito: delitos?.value[0]?.fechaHoraRango
      ? dateTimeUtil.formatToBackendWithTime(delitos?.value[0]?.fechaHoraDelitoInicio)
      : dateTimeUtil.formatToBackendWithTime(delitos?.value[0]?.fechaOcurrencia),
    fechaHoraDelitoDesde: delitos?.value[0]?.fechaHoraRango
      ? dateTimeUtil.formatToBackendWithTime(delitos?.value[0]?.fechaHoraDelitoInicio)
      : '',
    fechaHoraDelitoHasta: delitos?.value[0]?.fechaHoraRango
      ? dateTimeUtil.formatToBackendWithTime(delitos?.value[0]?.fechaHoraDelitoFin)
      : '',
    palabraClave: datosCompletosCausa.value.relato?.palabraClave ?? '',

    region: delitos.value[0]?.direccionDelito?.region.toUpperCase() ?? '',
    comuna: delitos.value[0]?.direccionDelito?.comuna.toUpperCase() ?? '',
    calle: delitos.value[0]?.direccionDelito?.calle.toUpperCase() ?? '',
    numeroCalle: delitos.value[0]?.direccionDelito?.numero ?? '',

    tipoConsulta: 'combinada',

    relato: datosCompletosCausa.value.relato?.palabraClave ?? ''
  }

  criteriosBusqueda.value = {
    nombreCompletoDenunciante: nombreCompletoDenunciante,
    nombreCompletoVictima: nombreCompletoVictima,
    nombreCompletoImputado: nombreCompletoImputado,
    fechaHoraRango: delitos?.value[0]?.fechaHoraRango,
    fechaOcurrencia: dateTimeUtil.formatToFrontendWithTime(
      delitos?.value[0]?.fechaOcurrencia
    ),
    fechaHoraDelitoInicio: dateTimeUtil.formatToFrontendWithTime(
      delitos?.value[0]?.fechaHoraDelitoInicio
    ),
    fechaHoraDelitoFin: dateTimeUtil.formatToFrontendWithTime(
      delitos?.value[0]?.fechaHoraDelitoFin
    ),
    nombreDelito: nombreDelito,
    lugarDelito: direccionDelito ?? null
  }
  const data = {
    dataBuscarDuplicidad: formDataBuscarDuplicidad,
    url: ''
  }
  console.log('Data para validar la duplicidad: ', data)

  // DESCOMENTAR CUANDO HAYA ENDPOINT PARA VALIDAR DUPLICIDAD
  setTimeout(() => {
    dialogBuscandoDuplicidad.value = false
    toastSuccess(
      'Sin Coincidencias. No se encontraron posibles Causas Duplicadas'
    )
  }, 1000)
}

function handleConfirmarCausaDuplicada () {
  console.error(tablaCausasCandidatas.value?.candidataSeleccionada)

  const samplePayload = {
    procesoPam: {
      ...procesoPam.value,
      usuario: $userName.value
    },
    dataCausaDuplicada: {
      idSolicitudCausa: 'string',
      idCausaExistente: 'string',
      esCausaDuplicada: true,
      tipoDenuncia: 'fisica',
      rolUnicoCausaOriginal: ''
    }
  }

  launchDialog({
    component: ModalGenerarDenuncia,
    header: 'Causa Actualizada',
    confirmLabel: 'Aceptar',
    width: '30%',
    props: {},
    accept: () => {
      requestUtil({
        action: crearCausa_crearCausaOficio_Fisica,
        payload: {
          ...samplePayload
        }
      })
    },
    reject: () => {
      console.error('reject')
    }
  })
}

const { flujoOrigen, sendToFichaCausa } = useFichaCausa()

function handleNextStep () {
  if (ruc.value) {
    // crearCarpetaDocumental()
    sendToFichaCausa({
      origenCausa:
        tipoDenunciaObject.value.codigo === '3'
          ? flujoOrigen.DENUNCIA_OFICIO
          : flujoOrigen.DENUNCIA_FISICA,
      ruc: ruc.value,
      idCausa: idCausa.value,
      idDenuncia: idDenuncia.value
    })
  } else {
    const delito = delitos.value
    const delitosIds = delito.map(
      ({ idDetalleHechoDelictual }) => idDetalleHechoDelictual
    )
    launchConfirmDialog({
      message: '¿Está seguro de Generar Causa?',
      accept: () => {
        loadingGenerarDenuncia.value = true
        const PayloadCausa = {
          usuario: {
            nombre: $userName.value,
            userSub: $userSub.value,
            rol: $userPrincipalRole.value,
            fiscalia: $userFiscaliaActual.value.fiscalia.toString(),
            region: $userFiscaliaActual.value.region.toString()
          },
          procesoPam: {
            idCausa: procesoPam.value.idCausa,
            idDenuncia: procesoPam.value.idDenuncia,
            processInstanceId:
              procesoPam.value.taskProcessInstanceId.toString(),
            taskInstanceId: procesoPam.value.taskId.toString()
          },
          dataCausaDuplicada: {
            idSolicitudCausa: procesoPam.value.idCausa ?? 'SinIdCausa', // vienen null o no vienen y no pasan el post
            rolUnicoCausaOriginal: null,
            esCausaDuplicada: false,
            codTipoDenuncia: tipoDenunciaObject.value.codigo
          },
          dataCausa: {
            esPrioritaria: false,
            esReservada: identificacionDenuncia.value.esReservada ?? false, // vienen null o no vienen y no pasan el post
            fecha: new Date(),
            idDenuncia: procesoPam.value.idDenuncia,
            idDetalleHechoDelictual: [...delitosIds],
            nombre: 'Recibir Denuncia',
            ruc: '',
            existenAntecedentesDelicutales: true,
            esFlagrante: false,
            solicitudAntecedentesEspecificos: true,
            registraRecomentacionesPreclasificador: true,
            contieneEspeciesNoDeclaradas: false,
            documentacionCompleta: true,
            identificadorUnicoDenuncia:
              identificacionDenuncia.value.identificadorUnicoDenuncia,
            codigoTipoDenuncia: tipoDenunciaObject.value.codigo
          }
        }
        toastWarning('Se denego la duplicidad de la denuncia')

        requestUtil({
          action: crearCausa_crearCausaOficio_Fisica,
          payload: PayloadCausa,
          resolve: () => {
            loadingGenerarDenuncia.value = false
            launchDialog({
              component: ModalGenerarDenuncia,
              header: 'Causa Generada',
              confirmLabel: 'Aceptar',
              width: '30%',
              cancelLabel: 'hideCancelLabel',
              props: { identificacionDenuncia },
              accept: () => {
                sendToFichaCausa({
                  origenCausa:
                    tipoDenunciaObject.value.codigo === '3'
                      ? flujoOrigen.DENUNCIA_OFICIO
                      : flujoOrigen.DENUNCIA_FISICA,
                  ruc: ruc.value,
                  idCausa: idCausa.value,
                  idDenuncia: idDenuncia.value
                })
              }
            })
          },
          reject: (err) => {
            toastError('Ha ocurrido un error', err)
          }
        })
      }
    })
  }
}
const readOnly = true
const isValidarDuplicidad = true
const listaOpcionesAcciones = ref([
  {
    label: 'Sujetos Intervinientes',
    command: () => {
      launchDialog({
        component: TablaSujetos,
        header: 'Sujetos Intervinientes',
        width: '55%',
        props: { readOnly, isValidarDuplicidad, idDenuncia: procesoPam.value.idDenuncia }
      })
    }
  },
  {
    label: 'Delitos',
    command: () => {
      const dataDelitos = delitos.value
      launchDialog({
        component: TablaDelitos,
        header: 'Delitos',
        width: '70%',
        props: {
          dataDelitos,
          isValidarDuplicidad,
          idDenuncia: procesoPam.value.idDenuncia,
          readOnly
        }
      })
    }
  },
  {
    label: 'Relaciones',
    command: () => {
      const dataRelaciones = relaciones.value
      launchDialog({
        component: TablaRelaciones,
        header: 'Relaciones',
        width: '60%',
        props: {
          dataRelaciones,
          readOnly
        }
      })
    }
  },
  {
    label: 'Especies y Dinero',
    command: () => {
      const dataEspeciesDinero = especiesData.value
      launchDialog({
        component: TablaEspeciesDinero,
        header: 'Especies y Dinero',
        width: '60%',
        props: {
          dataEspeciesDinero,
          readOnly
        }
      })
    }
  },
  {
    label: 'Relato',
    command: () => {
      launchDialog({
        component: ModalRelato,
        header: 'Relato',
        width: '70%',
        props: {
          relato,
          readOnly
        }
      })
    }
  },
  {
    label: 'Documentos',
    command: () => {
      launchDialog({
        component: TablaDocumentos,
        header: 'Documentos',
        width: '50%',
        props: { readOnly }
      })
    }
  }
])

const itemsMenuSuperior = ref([
  {
    label: 'Denuncia',
    icon: 'pi pi-question',
    items: listaOpcionesAcciones
  },
  {
    label: 'Actualizar',
    icon: 'pi pi-replay',
    command: ({ item }) => console.log(item.label)
  },
  {
    label: 'Exportar',
    icon: 'pi pi-download',
    command: ({ item }) => console.log(item.label)
  }
])

if (!sujetosIntervinientes.value.length) getSujetos()
function getSujetos (pagination = undefined) {
  requestUtil({
    action: sujetosIntervinientes_getSujetosByIdGlobal,
    payload: {
      idDenuncia: procesoPam.value.idDenuncia,
      params: {
        page: pagination?.page,
        size: pagination?.rows
      }
    }
  })
}
if (!delitos.value.length) getDelitos()
function getDelitos (pagination = undefined) {
  requestUtil({
    action: delito_getDelitoByIdDenuncia,
    payload: {
      idDenuncia: procesoPam.value.idDenuncia,
      params: {
        page: pagination?.page,
        size: pagination?.rows
      }
    }
  })
}

if (!relaciones.value.length) getRelaciones()
function getRelaciones (pagination = undefined) {
  requestUtil({
    action: relaciones_getRelaciones,
    payload: {
      idDenuncia: procesoPam.value.idDenuncia,
      params: {
        page: pagination?.page,
        size: pagination?.rows
      }
    }
  })
}

if (!especiesData.value.length) getEspeciesDinero()
function getEspeciesDinero (pagination = undefined) {
  requestUtil({
    action: especiesDinero_getEspecieByIdDenuncia,
    payload: {
      idDenuncia: procesoPam.value.idDenuncia,
      params: {
        page: pagination?.page,
        size: pagination?.rows
      }
    }
  })
}
if (!relato.value) getRelatoById()
function getRelatoById (pagination = undefined) {
  requestUtil({
    action: relato_getRelatoByIdDenuncia,
    payload: {
      idDenuncia: procesoPam.value.idDenuncia
    }
  })
}
</script>
