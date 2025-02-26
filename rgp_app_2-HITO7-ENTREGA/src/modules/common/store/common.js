export default {
  namespaced: true,

  state: {
    toast: null
  },

  mutations: {
    common_LAUNCH_TOAST (state, { type, detail }) {
      state.toast = { type, detail }
    }
  }
}
