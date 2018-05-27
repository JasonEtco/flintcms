import permissions from '../../server/utils/permissions.json'

export default `
  permissions {
    ${Object.keys(permissions).map(key => `${key} {\n${permissions[key].map(({ name }) => `\t${name}`).join('\n')}\n}`).join('\n')}
  }
`
