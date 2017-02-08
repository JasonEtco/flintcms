import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import io from 'socket.io-client';

import user from '../reducers/user';
import entries from '../reducers/entries';

const socket = io();

// Combine reducers into one, easily ingestible file
// which is then imported into the Redux store
// ----
// Create an empty object to avoid extra reducers
// recipes: (state = {}) => state,
const rootReducer = combineReducers({
  user,
  entries,
  socket: (state = socket) => state,
  routing: routerReducer,
});

export default rootReducer;
