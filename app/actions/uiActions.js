import store from '../utils/store'

export const NEW_TOAST = 'NEW_TOAST'
export const DELETE_TOAST = 'DELETE_TOAST'
export const OPEN_MODAL = 'OPEN_MODAL'
export const CLOSE_MODALS = 'CLOSE_MODALS'

/**
 * Creates a new Toast
 * @param {String|Object} toast - Can be a React component or a simple String.
 * @param {String} toast.style - Success, default or error.
 * @param {String|Object} toast.message - Can be a React component or a simple String.
 */
export function newToast (toast) {
  if (typeof toast === 'string' || !Object.prototype.hasOwnProperty.call(toast, 'message')) {
    return {
      type: NEW_TOAST,
      message: toast,
      dateCreated: Date.now()
    }
  }

  const { message, style } = toast

  return {
    type: NEW_TOAST,
    message,
    style,
    dateCreated: Date.now()
  }
}

/**
 * Creates a series of error-styled toasts
 * @param {Object} error - Error object from response
 */
export function errorToasts (error) {
  if (!error.response) return
  const { dispatch } = store
  const { errors } = error.response.data

  errors.forEach(err => dispatch(newToast({
    message: err.message,
    style: 'error'
  })))
}

/**
 * Deletes a Toast
 * @param {String} dateCreated
 */
export function deleteToast (dateCreated) {
  return {
    type: DELETE_TOAST,
    dateCreated
  }
}

/**
 * Opens a new Modal
 * @param {Object} currentModal - React component
 */
export function openModal (currentModal) {
  return {
    type: OPEN_MODAL,
    currentModal
  }
}

export function closeModals () {
  return {
    type: CLOSE_MODALS
  }
}
