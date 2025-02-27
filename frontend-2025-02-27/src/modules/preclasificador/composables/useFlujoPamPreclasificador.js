import { reactive } from 'vue'

const flujoDefault = {
  cambiarTipificacionOtro: false, // Requiere cambiar tipificacion
  obtieneAntecedentesEsp: false,
  revisaEspecies: false,
  revisaInformacionDelictual: false
}

const flujoPreclasificador = reactive({ ...flujoDefault })

export const useFlujoPamPreclasificador = () => {
  function resetFlujoPamPreclasificador () {
    Object.assign(flujoPreclasificador, flujoDefault)
  }

  return {
    flujoPreclasificador,
    resetFlujoPamPreclasificador
  }
}
