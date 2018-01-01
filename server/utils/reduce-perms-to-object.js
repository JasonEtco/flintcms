const perms = require('./permissions.json');

/**
 * Reduces the permissions object to one that is easier to format
 * @param {Function} reducer - Reducer to format the returned objects
 * @returns {Object}
 */
function reducePermissionsToObject(reducer) {
  return Object.keys(perms).reduce((prev, curr) =>
  Object.assign({}, prev, { [curr]: perms[curr].reduce(reducer, {}) }), {});
}

module.exports = reducePermissionsToObject;
