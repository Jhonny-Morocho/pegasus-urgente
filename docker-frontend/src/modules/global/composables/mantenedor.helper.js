export function useMantenedorHelper () {
  function getDescripcionMantenedorById (mantenedorList, id) {
    const found = mantenedorList?.find((mantenedor) => mantenedor.id === id)
    return found?.descripcion
  }

  function getCodigoMantenedorById (mantenedorList, id) {
    const found = mantenedorList?.find((mantenedor) => mantenedor.id === id)
    return found?.codigo
  }

  function getIdPadreMantenedorById (mantenedorList, id) {
    const found = mantenedorList?.find((mantenedor) => mantenedor.id === id)
    return found?.idPadre
  }

  function getDescripcionMantenedorByCodigo (mantenedorList, codigo) {
    const found = mantenedorList?.find(
      (mantenedor) => mantenedor.codigo === codigo
    )
    return found?.descripcion
  }

  function getIdMantenedorByCodigo (mantenedorList, codigo) {
    const found = mantenedorList?.find(
      (mantenedor) => mantenedor.codigo === codigo
    )
    return found?.id
  }

  function getIdPadreMantenedorByCodigo (mantenedorList, codigo) {
    const found = mantenedorList?.find(
      (mantenedor) => mantenedor.codigo === codigo
    )
    return found?.idPadre
  }

  return {
    getDescripcionMantenedorById,
    getCodigoMantenedorById,
    getIdPadreMantenedorById,
    getDescripcionMantenedorByCodigo,
    getIdMantenedorByCodigo,
    getIdPadreMantenedorByCodigo
  }
}
