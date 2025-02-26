export default {
  namespaced: true,

  state: () => ({
    paneles: {
      infoDenunciante: {
        label: 'Información del Denunciante',
        display: true,
        id: 1
      },
      sujetos: {
        label: 'Sujetos / Intervinientes',
        display: true,
        id: 2
      },
      relaciones: {
        label: 'Relaciones',
        display: true,
        id: 3
      },
      relato: {
        label: 'Relato del hecho',
        display: false,
        id: 4
      },
      delitos: {
        label: 'Delitos',
        display: true,
        id: 5
      },
      especies: {
        label: 'Especies / Dinero',
        display: true,
        id: 6
      },
      diligencias: {
        label: 'Diligencias',
        display: true,
        id: 7
      },
      documentos: {
        label: 'Documentos',
        display: true,
        id: 8
      },
      historial: {
        label: 'Historial de la Causa',
        display: true,
        id: 9
      }
    }
  }),

  actions: {
    async paneles_updatePanel ({ state: { paneles }, commit }, panelSeleccionado) {
      console.log({ panelSeleccionado })
      // Obtener la key del panel seleccionado
      const panelName = Object.keys(paneles).find(key => paneles[key].id === panelSeleccionado.id)
      const panelesUpdated = { ...paneles, [panelName]: { ...panelSeleccionado, display: !panelSeleccionado.display } }
      commit('paneles_SET_PANELES', panelesUpdated)
      // Esto retorna si se agregó el panel o se eliminó.
      return !paneles[panelName].display
    }
  },

  mutations: {
    paneles_SET_PANELES (state, payload) {
      state.paneles = payload
    }
  }
}
