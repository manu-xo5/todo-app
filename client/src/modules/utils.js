function filterNull ( obj ) {
  const _filterObj = {}

  for (const [key, value] of Object.entries(obj)) {
    if (value == null) continue
    _filterObj[key] = value;
  }

  return _filterObj
}

export { filterNull }