export const NEW_TOAST = 'NEW_TOAST';
export const DELETE_TOAST = 'DELETE_TOAST';

export function newToast(toast) {
  if (typeof toast === 'string' || !toast.hasOwnProperty('message')) {
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

export function deleteToast(dateCreated) {
  return {
    type: DELETE_TOAST,
    dateCreated,
  };
}
