import {
  NEW_TOAST,
  DELETE_TOAST,
  OPEN_MODAL,
  CLOSE_MODALS,
} from '../actions/uiActions';

export default function ui(state = {}, action) {
  switch (action.type) {
    case NEW_TOAST: {
      const { message, style, dateCreated } = action;
      return {
        ...state,
        toasts: [
          {
            message,
            style,
            dateCreated,
          },
          ...state.toasts,
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

    case OPEN_MODAL: {
      return {
        ...state,
        modalIsOpen: true,
        currentModal: action.currentModal,
      };
    }

    // Close any active modal
    case CLOSE_MODALS: {
      return {
        ...state,
        modalIsOpen: false,
        currentModal: null,
      };
    }


    default:
      return state;
  }
}
