export const NEW_TOAST = 'NEW_TOAST';
export const DELETE_TOAST = 'DELETE_TOAST';

export function newToast({ message, style, dateCreated }) {
  return {
    type: NEW_TOAST,
    message,
    style,
    dateCreated,
  };
}

export function deleteToast(dateCreated) {
  return {
    type: DELETE_TOAST,
    dateCreated,
  };
}
