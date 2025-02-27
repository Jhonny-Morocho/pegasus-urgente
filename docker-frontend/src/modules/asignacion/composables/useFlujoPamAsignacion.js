import { reactive } from 'vue'

const flujoDefault = {
  requiereCambiarTipificacion: false, // Cambiar tipificacion u otro
  revisaEspecies: false,
  revisaObtiene: false // Revisa y obtiene antecedentes
}

const flujoAsignacion = reactive({ ...flujoDefault })

export const useFlujoPamAsignacion = () => {
  function resetFlujoPamAsignacion () {
    Object.assign(flujoAsignacion, flujoDefault)
  }

  return {
    flujoAsignacion,
    resetFlujoPamAsignacion
  }
}
