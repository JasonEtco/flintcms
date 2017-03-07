module.exports = function getProjection(fieldASTs) {
  return fieldASTs.fieldNodes[0].selectionSet.selections.reduce((projections, selection) =>
    Object.assign({}, projections, { [selection.name.value]: 1 }), {});
};
