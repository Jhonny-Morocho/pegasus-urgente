import store from '@/store'

/**
 * @returns {Promise<any>} action promise
 */
export const requestUtil = async ({
  action,
  payload,
  loader,
  resolve,
  reject
}) => {
  try {
    loader?.(true)
    const response = await action({ ...payload })

    resolve?.(response)
  } catch (e) {
    if (!reject && e.response?.status !== 422) {
      console.error('error', e)
      store.commit('common/common_LAUNCH_TOAST', {
        type: 'error',
        detail: 'Ha ocurrido un error en el servidor, intente de nuevo'
      })
    }

    reject?.(e)
  } finally {
    loader?.(false)
  }
}
