export const NEW_TOAST = 'NEW_TOAST';
export const DELETE_TOAST = 'DELETE_TOAST';
export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODALS = 'CLOSE_MODALS';

export function newToast(toast) {
  if (typeof toast === 'string' || !toast.hasOwnProperty('message')) { // eslint-disable-line
    return {
      type: NEW_TOAST,
      message: toast,
      dateCreated: Date.now(),
    };
  }

  const { message, style } = toast;

  return {
    type: NEW_TOAST,
    message,
    style,
    dateCreated: Date.now(),
  };
}

export function errorToasts(errors) {
  return dispatch => errors.forEach(err => dispatch(newToast({
    message: err.message,
    style: 'error',
  })));
}

export function deleteToast(dateCreated) {
  return {
    type: DELETE_TOAST,
    dateCreated,
  };
}

export function openModal(currentModal) {
  return {
    type: OPEN_MODAL,
    currentModal,
  };
}

export function closeModals() {
  return {
    type: CLOSE_MODALS,
  };
}
