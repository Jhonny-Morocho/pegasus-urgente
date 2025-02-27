import { useNewTabRouter } from '@/utils'
import { useRouter } from 'vue-router'
import { useFichaCausaStore } from './fichaCausaStore'
/* eslint-disable */
export function useFichaCausa () {
  const router = useRouter()
  const { pushToNewTab } = useNewTabRouter()

  const {
    fichaCausa_SET_ORIGEN_CAUSA,
    fichaCausa_SET_ID_DENUNCIA,
    fichaCausa_SET_ID_CAUSA,
    fichaCausa_SET_CAUSA,
    fichaCausa_SET_RUC
  } = useFichaCausaStore()
/* eslint-disable */
  /**
   * @typedef FlujoOrigen
   * @property {string} DENUNCIA_DIRECTA "directa"
   * @property {string} DENUNCIA_OFICIO "oficio"
   * @property {string} DENUNCIA_FISICA "fisica"
   * @property {string} TRANSVERSAL "transversal"
   */

  /**
   * Enum para el origen de la causa.
   * @readonly
   * @enum {flujoOrigen}
   */
  const flujoOrigen = {
    DENUNCIA_DIRECTA: 'directa',
    DENUNCIA_OFICIO: 'oficio',
    DENUNCIA_FISICA: 'fisica',
    TRANSVERSAL: 'transversal'
  }

  /**
   * Redirige a la Vista Ficha Causa
   * @example
   * sendToFichaCausa({
   *  origenCausa: flujoOrigen.DENUNCIA_DIRECTA, // importar flujoOrigen desde useFichaCausa
   *  ruc: ruc.value,
   *  idDenuncia: idDenuncia.value,
   *  idCausa: idCausa.value,
   *  causa: causa.value, // Solo para flujo DENUNCIA_DIRECTA
   *  newTab: true, // abre la ficha causa en una nueva pestaña
   * });
   * @param {{ origenCausa: FlujoOrigen, ruc: string, idDenuncia: String, idCausa: String, causa?: object,  newTab: Boolean }} origenCausa Origen de la Causa
   * @param {*} ruc RUC de la Causa
   * @param {*} idDenuncia idDenuncia de la Causa
   * @param {*} idCausa idCausa de la Causa
   * @param {*} causa objeto causa (opcional, solo es requerido en el flujo DENUNCIA_DIRECTA)
   * @param {*} newTab abrir la ficha causa en una nueva pestaña
   *
   */
  function sendToFichaCausa ({ origenCausa, ruc, idDenuncia, idCausa, causa, newTab }) {
    fichaCausa_SET_ORIGEN_CAUSA(origenCausa)
    fichaCausa_SET_ID_DENUNCIA(idDenuncia)
    fichaCausa_SET_ID_CAUSA(idCausa)
    fichaCausa_SET_RUC(ruc)

    if (origenCausa == flujoOrigen.DENUNCIA_DIRECTA) {
      fichaCausa_SET_CAUSA(causa)
    }

    const routerOptions = { name: 'FCInformacionCausa', params: { ruc: ruc } }

    newTab ? pushToNewTab(routerOptions) : router.push(routerOptions)
  }

  return { flujoOrigen, sendToFichaCausa }
}
