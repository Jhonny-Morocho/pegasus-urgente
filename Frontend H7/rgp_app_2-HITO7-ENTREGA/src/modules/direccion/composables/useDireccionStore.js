import { computed } from 'vue'
import { useStore } from 'vuex'

export const useDireccionStore = () => {
  const { state, dispatch } = useStore()

  return {
    direcciones: computed(() => state.direccion.direcciones),
    direccion: computed(() => state.direccion.direccion),
    paginacion: computed(() => state.direccion.paginacion),

    direccion_getDirecciones: (payload) =>
      dispatch('direccion/direccion_getDirecciones', payload),
    direccion_addDireccion: (payload) =>
      dispatch('direccion/direccion_addDireccion', payload),
    direccion_deleteDireccion: (payload) =>
      dispatch('direccion/direccion_deleteDireccion', payload),
    direccion_getDireccion: (payload) =>
      dispatch('direccion/direccion_getDireccion', payload),
    direccion_putActualizarDireccion: (payload) =>
      dispatch('direccion/direccion_putActualizarDireccion', payload),
    direccion_getDireccionOrganismoColaborador: (payload) =>
      dispatch('direccion/direccion_getDireccionOrganismoColaborador', payload)
  }
}
