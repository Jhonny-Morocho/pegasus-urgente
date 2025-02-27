import { computed } from 'vue'
import { useStore } from 'vuex'

export const useIdentificacionDenunciaStore = () => {
  const { state, dispatch, commit } = useStore()

  return {
    /* COMPUTED STATE */
    identificacionDenuncia: computed(
      () => state.identificacionDenuncia.identificacionDenuncia
    ),

    saved: computed(() => state.identificacionDenuncia.saved),

    informacionInstitucion: computed(
      () => state.identificacionDenuncia.informacionInstitucion
    ),

    idProcedimiento: computed(
      () => state.identificacionDenuncia.idProcedimiento
    ),
    tipoDenunciaObject: computed(
      () => state.identificacionDenuncia.tipoDenunciaObject
    ),
    idFiscalia: computed(() => state.identificacionDenuncia.idFiscalia),
    direccionFiscalia: computed(
      () => state.identificacionDenuncia.direccionFiscalia
    ),
    idCatalogo: computed(() => state.identificacionDenuncia.idCatalogo),

    /* ACTIONS */
    identificacionDenuncia_getIdentificadorUnicoDenuncia: (id) =>
      dispatch(
        'identificacionDenuncia/identificacionDenuncia_getIdentificadorUnicoDenuncia',
        id
      ),

    identificacionDenuncia_guardarInformacionInstitucion: (payload) =>
      dispatch(
        'identificacionDenuncia/identificacionDenuncia_guardarInformacionInstitucion',
        payload
      ),
    identificacionDenuncia_getInformacionInstitucion: (payload) =>
      dispatch(
        'identificacionDenuncia/identificacionDenuncia_getInformacionInstitucion',
        payload
      ),

    identificacionDenuncia_getParteDenuncia: (id) =>
      dispatch(
        'identificacionDenuncia/identificacionDenuncia_getParteDenuncia',
        id
      ),

    identificacionDenuncia_getByIdDenuncia: (id) =>
      dispatch(
        'identificacionDenuncia/identificacionDenuncia_getByIdDenuncia',
        id
      ),

    identificacionDenuncia_iniciarProceso: () =>
      dispatch('identificacionDenuncia/identificacionDenuncia_iniciarProceso'),

    identificacionDenuncia_tipoFiscalia: () =>
      dispatch('identificacionDenuncia/identificacionDenuncia_tipoFiscalia'),

    identificacionDenuncia_addIdentificacion: (payload) =>
      dispatch(
        'identificacionDenuncia/identificacionDenuncia_addIdentificacion',
        payload
      ),
    identificacionDenuncia_getTipoDenuncia: (payload) =>
      dispatch(
        'identificacionDenuncia/identificacionDenuncia_getTipoDenuncia',
        payload
      ),
    identificacionDenuncia_getIdFiscaliaByIdFiscaliaMantenedor: (payload) =>
      dispatch(
        'identificacionDenuncia/identificacionDenuncia_getIdFiscaliaByIdFiscaliaMantenedor',
        payload
      ),
    identificacionDenuncia_getDireccionFiscalia: (payload) =>
      dispatch(
        'identificacionDenuncia/identificacionDenuncia_getDireccionFiscalia',
        payload
      ),

    /* MUTATIONS */
    identificacionDenuncia_SET_DEFAULT_STATE: () =>
      commit('identificacionDenuncia/identificacionDenuncia_SET_DEFAULT_STATE'),

    // delito_ADD_MEDIO_TRANSPORTE: (medioTransporte) =>
    //   commit('delitoGb/delito_ADD_MEDIO_TRANSPORTE', medioTransporte),\

    // SET ID CATALOGO
    identificacionDenuncia_SET_ID_CATALOGO: (idCatalogo) =>
      commit(
        'identificacionDenuncia/identificacionDenuncia_SET_ID_CATALOGO',
        idCatalogo
      )
  }
}
