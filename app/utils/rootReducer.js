import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import io from 'socket.io-client';

import user from '../reducers/user';
import users from '../reducers/users';
import usergroups from '../reducers/usergroups';
import entries from '../reducers/entries';
import sections from '../reducers/sections';
import fields from '../reducers/fields';
import assets from '../reducers/assets';
import site from '../reducers/site';
import ui from '../reducers/ui';

const socket = io();

// Combine reducers into one, easily ingestible file
// which is then imported into the Redux store
// ----
// Create an empty object to avoid extra reducers
// recipes: (state = {}) => state,
const rootReducer = combineReducers({
  user,
  users,
  usergroups,
  entries,
  sections,
  fields,
  assets,
  ui,
  site,
  socket: (state = socket) => state,
  routing: routerReducer,
});

export default rootReducer;
