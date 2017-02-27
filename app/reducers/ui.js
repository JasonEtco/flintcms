import {
  NEW_TOAST,
  DELETE_TOAST,
} from '../actions/uiActions';

export default function ui(state = {}, action) {
  switch (action.type) {
    case NEW_TOAST: {
      const { message, style, dateCreated } = action;
      return {
        ...state,
        toasts: [
          ...state.toasts,
          {
            message,
            style,
            dateCreated,
          },
        ],
      };
    }

    case DELETE_TOAST: {
      const toastIndex = state.toasts.findIndex(toast => toast.dateCreated === action.dateCreated);
      if (toastIndex === -1) return state;

      return {
        ...state,
        toasts: [
          ...state.toasts.slice(0, toastIndex),
          ...state.toasts.slice(toastIndex + 1),
        ],
      };
    }

    default:
      return state;
  }
}
