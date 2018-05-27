import store from 'utils/store'

export default function getUserPermissions () {
  return store.getState().user.usergroup.permissions
}
