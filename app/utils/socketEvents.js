import { NEW_SECTION } from '../actions/sectionActions';
import { NEW_ENTRY } from '../actions/entryActions';
import store from './store';

export default class SocketEvents {
  constructor(socket, dispatch) {
    this.dispatch = dispatch;
    this.socket = socket;
  }

  newEntry() {
    this.socket.on('new-entry', (newEntry) => {
      if (!store.getState().entries.entries.some(entry => entry._id === newEntry._id)) {
        this.dispatch({ type: NEW_ENTRY, json: newEntry });
      }
    });
  }

  deleteEntry() {
    this.socket.on('delete-entry', deletedId => console.log(deletedId));
  }

  newSection() {
    this.socket.on('new-section', newSection => this.dispatch({ type: NEW_SECTION, newSection }));
  }

  deleteSection() {
    this.socket.on('delete-section', deletedId => console.log(deletedId));
  }

  listen() {
    this.newEntry();
    this.deleteEntry();
    this.newSection();
    this.deleteSection();
  }
}
