import { useStore } from 'vuex'
import { computed } from 'vue'

export const useLevantamientoCadenaCustodio = () => {
  const { state, dispatch, commit } = useStore()

  return {
    imagenes: computed(() => state.levantamientoCadenaCustodio.imagenes),
    evidencias: computed(() => state.levantamientoCadenaCustodio.evidencias),
    cadenaLevantamiento: computed(() => state.levantamientoCadenaCustodio.cadenaLevantamiento),

    levantamientoCadena_getEvidencias: (payload) => dispatch('levantamientoCadenaCustodio/levantamientoCadena_getEvidencias', payload),
    levantamientoCadena_getDataRotuloNue: (payload) => dispatch('levantamientoCadenaCustodio/levantamientoCadena_getDataRotuloNue', payload),
    levantamientoCadena_getNue: (payload) => dispatch('levantamientoCadenaCustodio/levantamientoCadena_getNue', payload),
    levantamientoCadena_addEvidencia: (payload) => dispatch('levantamientoCadenaCustodio/levantamientoCadena_addEvidencia', payload),
    levantamientoCadena_addLevantamientoCadena: (payload) => dispatch('levantamientoCadenaCustodio/levantamientoCadena_addLevantamientoCadena', payload),
    levantamientoCadenaCustodio_addImagen: (imagen) =>
      dispatch('levantamientoCadenaCustodio/levantamientoCadenaCustodio_addImagen', imagen),

    levantamientoCadenaCustodio_DELETE_IMAGEN: (idImagen) =>
      commit('levantamientoCadenaCustodio/levantamientoCadenaCustodio_DELETE_IMAGEN', idImagen),
    levantamientoCadenaCustodio_DELETE_EVIDENCIA: (idEvidencia) =>
      commit('levantamientoCadenaCustodio/levantamientoCadenaCustodio_DELETE_EVIDENCIA', idEvidencia),
    levantamientoCadenaCustodio_SET_DATA_EVIDENCIA: (idEvidencia) =>
      commit('levantamientoCadenaCustodio/levantamientoCadenaCustodio_SET_DATA_EVIDENCIA', idEvidencia),
    levantamientoCadenaCustodio_SET_EVIDENCIA: (payload) => commit('levantamientoCadenaCustodio/levantamientoCadenaCustodio_SET_EVIDENCIA', payload),
    levantamientoCadenaCustodio_SET_TABLA_IMAGEN: (payload) =>
      commit('levantamientoCadenaCustodio/levantamientoCadenaCustodio_SET_TABLA_IMAGEN', payload)
  }
}
