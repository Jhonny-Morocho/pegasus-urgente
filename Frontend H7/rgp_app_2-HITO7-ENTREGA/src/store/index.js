import { createStore } from 'vuex'

import createPersistedState from 'vuex-persistedstate'

import common from '@/modules/common/store/common'
import session from '@/modules/session/store/session'
import direccion from '@/modules/direccion/store/direccion'
import mantenedor from '@/modules/global/store/mantenedor'

// global
import stepEspeciesDinero from '@/modules/global/store/stepEspeciesDinero'
import sujetosIntervinientes from '@/modules/global/store/sujetosIntervinientes'
import documentoGb from '@/modules/global/store/documento'
import delitoGb from '@/modules/global/store/delito'
import relacionesGb from '@/modules/global/store/relaciones'
import buscarDuplicidad from '@/modules/global/store/buscarDuplicidad'
import pam from '@/modules/global/store/pam'
import especiesDineroGb from '@/modules/global/store/especiesDinero'
import relatoGb from '@/modules/global/store/relato'
import oficinaPartesStore from '@/modules/global/store/oficinaPartesStore'
import funcionarios from '@/modules/global/store/funcionarios'
import diligencia from '@/modules/global/store/diligencia'
import antecedentesCausa from '@/modules/global/store/antecedentesCausa'
import anotacionCausa from '@/modules/global/store/anotacionCausa'
import historialCausa from '@/modules/global/store/historialCausa'
import cargaTrabajo from '@/modules/global/store/cargaTrabajo'
import causasRelacionadas from '@/modules/global/store/causasRelacionadas'
import georreferencia from '@/modules/global/store/georreferencia'
import actividad from '@/modules/global/store/actividad'
import infoDelictualSujeto from '@/modules/global/store/infoDelictualSujeto'

// flagrancia
import stepRegistroContacto from '@/modules/flagrancia/store/stepRegistroContacto'
import procedimientosBandeja from '@/modules/flagrancia/store/procedimientosBandeja'
import stepDocumentos from '@/modules/flagrancia/store/stepDocumentos'
import stepDiligencia from '@/modules/flagrancia/store/stepDiligencia'
import stepDetenidosACD from '@/modules/flagrancia/store/stepDetenidosACD'

// preclasificador
import bandejaPreclasificador from '@/modules/preclasificador/store/bandejaPreclasificador'
import competenciaTerritorial from '@/modules/preclasificador/store/competenciaTerritorial'
import solicitudAntecedentes from '@/modules/preclasificador/store/solicitudAntecedentes'
import causaPreclasificador from '@/modules/preclasificador/store/causaPreclasificador'

// asignacion
import causaAsignacion from '@/modules/asignacion/store/causaAsignacion'
import bandejaAsignacion from '@/modules/asignacion/store/bandejaAsignacion'

// ingreso
import identificacionDenuncia from '@/modules/ingreso/store/identificacionDenuncia'
import bandejaAtendedorJuridico from '@/modules/ingreso/store/bandejaAtendedorJuridico'
import bandejaDenunciaOficio from '@/modules/ingreso/store/bandejaDenunciaOficio'
import bandejaDenunciaFisica from '@/modules/ingreso/store/bandejaDenunciaFisica'
import crearCausa from '@/modules/ingreso/store/crearCausa'

// Recepcion Especies Dinero
import bandejaCustodio from '@/modules/recepcion-especies-dinero/store/bandejaCustodio'
import stepComprobanteDeRecepcionRechazo from '@/modules/recepcion-especies-dinero/store/stepComprobanteDeRecepcionRechazo'
import stepEspeciesIncautadasPendientesDeRecepcion from '@/modules/recepcion-especies-dinero/store/stepEspeciesIncautadasPendientesDeRecepcion'
import stepIdentificacionNue from '@/modules/recepcion-especies-dinero/store/stepIdentificacionNue'
import levantamientoCadenaCustodio from '@/modules/recepcion-especies-dinero/store/levantamientoCadenaCustodio'
import verCadenaCustodio from '@/modules/recepcion-especies-dinero/store/verCadenaCustodio'
import solicitudAsignacionNue from '@/modules/recepcion-especies-dinero/store/solicitudAsignacionNue'
import agregarEslabon from '@/modules/recepcion-especies-dinero/store/agregarEslabon'
import generarCuponDeDeposito from '@/modules/recepcion-especies-dinero/store/generarCuponDeDeposito'
import stepIngresoDinero from '@/modules/recepcion-especies-dinero/store/stepIngresoDinero'
import stepDatosInspeccionVisual from '@/modules/recepcion-especies-dinero/store/stepDatosInspeccionVisual'
import stepComprobanteDeInspeccionVisual from '@/modules/recepcion-especies-dinero/store/stepComprobanteDeInspeccionVisual'
import stepBusquedaAgregarSepararEspecies from '@/modules/recepcion-especies-dinero/store/stepBusquedaAgregarSepararEspecies'
import fijacionfotografica from '@/modules/recepcion-especies-dinero/store/fijacionFotografica'
import subirArchivosStore from '@/modules/recepcion-especies-dinero/store/subirArchivosStore'
import revisarInstruccion from '@/modules/recepcion-especies-dinero/store/revisarInstruccion'
import registroSalida from '@/modules/recepcion-especies-dinero/store/registroSalida'
import salidaDinero from '@/modules/recepcion-especies-dinero/store/salidaDinero'

// Dirigir Investigacion - Hito 6
import dirigirInvestigacion from '@/modules/dirigir-investigacion/store/dirigirInvestigacion'
import solicitudAntecedentesH6 from '@/modules/dirigir-investigacion/store/solicitudAntecedentes'
import bandejaDirigirInvestigacion from '@/modules/dirigir-investigacion/store/bandejaDirigirInvestigacion'

// CDD
import creacionYGestionDeCDD from '@/modules/catalogo-documental-digital/store/creacionYGestionDeCDD'
import eliminarDocumentosCDD from '@/modules/catalogo-documental-digital/store/eliminarDocumentosCDD'
import mantenedorCDD from '@/modules/catalogo-documental-digital/store/mantenedorCDD'
import solicitudesFiscalCDD from '@/modules/catalogo-documental-digital/store/solicitudesFiscalCDD'
import solicitudesEncargadoBodega from '@/modules/catalogo-documental-digital/store/solicitudesEncargadoBodega'

import solicitudesOfDePartes from '@/modules/catalogo-documental-digital/store/solicitudesOfDePartes'

// Termino y Postermino - Hito 7
import bandejaFiscal from '@/modules/termino-postermino/store/bandejaFiscal'
import bandejaFiscalJefe from '@/modules/termino-postermino/store/bandejaFiscalJefe'
import bandejaFiscalRegional from '@/modules/termino-postermino/store/bandejaFiscalRegional'
import termino from '@/modules/termino-postermino/store/termino'
import postermino from '@/modules/termino-postermino/store/postermino.js'
import gestionDireccionInvestigacion from '@/modules/termino-postermino/store/gestionDireccionInvestigacion'

// Gestion de Solicitudes - Hito X
import gestionSolicitudes from '@/modules/gestion-solicitudes/store/gestionSolicitudes'
import pamGestionSolicitudes from '@/modules/gestion-solicitudes/store/pamGestionSolicitudes'
import bandejaGestionSolicitudes from '@/modules/gestion-solicitudes/store/bandejaGestionSolicitudes'

// Solicitudes
import solicitudes from '@/modules/solicitudes/store/solicitudesStore'

import fichaCausa from '@/modules/ficha-causa/store/fichaCausa'

// Tramitar Audiencia - Hito X
import tramitarAudiencia from '@/modules/tramitar-audiencia/store/tramitarAudiencia'
import bandejaTramitarAudiencia from '@/modules/tramitar-audiencia/store/bandejaTramitarAudiencia'
import panelesStore from '@/modules/tramitar-audiencia/store/panelesStore'

const store = createStore({
  modules: {
    common,
    session,
    direccion,
    mantenedor,
    stepRegistroContacto,
    procedimientosBandeja,
    sujetosIntervinientes,
    stepDocumentos,
    stepDiligencia,
    stepEspeciesDinero,
    stepDetenidosACD,
    bandejaPreclasificador,
    documentoGb,
    delitoGb,
    relacionesGb,
    pam,
    especiesDineroGb,
    anotacionCausa,
    historialCausa,
    buscarDuplicidad,
    relatoGb,
    identificacionDenuncia,
    bandejaAtendedorJuridico,
    fichaCausa,
    georreferencia,
    crearCausa,
    oficinaPartesStore,
    funcionarios,
    bandejaDenunciaOficio,
    bandejaDenunciaFisica,
    bandejaCustodio,
    stepComprobanteDeRecepcionRechazo,
    stepEspeciesIncautadasPendientesDeRecepcion,
    stepIdentificacionNue,
    antecedentesCausa,
    competenciaTerritorial,
    causasRelacionadas,
    cargaTrabajo,
    solicitudAntecedentes,
    causaPreclasificador,
    // #region Asignacion
    causaAsignacion,
    bandejaAsignacion,
    diligencia,
    levantamientoCadenaCustodio,
    verCadenaCustodio,
    solicitudAsignacionNue,
    agregarEslabon,
    generarCuponDeDeposito,
    stepIngresoDinero,
    stepDatosInspeccionVisual,
    stepComprobanteDeInspeccionVisual,
    stepBusquedaAgregarSepararEspecies,
    fijacionfotografica,
    subirArchivosStore,
    revisarInstruccion,
    registroSalida,
    salidaDinero,
    // #endregion
    dirigirInvestigacion,
    solicitudAntecedentesH6,
    // INI CDD
    solicitudesFiscalCDD,
    mantenedorCDD,
    eliminarDocumentosCDD,
    creacionYGestionDeCDD,
    solicitudesOfDePartes,
    solicitudesEncargadoBodega,
    // FIN CDD
    bandejaDirigirInvestigacion,
    bandejaFiscal,
    bandejaFiscalJefe,
    termino,
    postermino,
    gestionDireccionInvestigacion,
    gestionSolicitudes,
    bandejaGestionSolicitudes,
    pamGestionSolicitudes,
    bandejaFiscalRegional,
    // #region Tramitar Audiencia
    tramitarAudiencia,
    bandejaTramitarAudiencia,
    panelesStore,
    solicitudes,
    // #endregion
    actividad,
    infoDelictualSujeto
  },
  plugins: [createPersistedState({ key: process.env.VUE_APP_STORE_KEY })]
})

export default store
