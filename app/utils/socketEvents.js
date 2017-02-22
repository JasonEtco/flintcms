import { NEW_SECTION } from '../actions/sectionActions';
import { NEW_ENTRY } from '../actions/entryActions';
import { NEW_FIELD } from '../actions/fieldActions';
import store from './store';

export default class SocketEvents {
  constructor(socket, dispatch) {
    this.dispatch = dispatch;
    this.socket = socket;
  }

  newField() {
    const { fields } = store.getState().fields;
    this.socket.on('new-field', (newField) => {
      if (!fields.some(field => field._id === newField._id)) {
        this.dispatch({ type: NEW_FIELD, json: newField });
      }
    });
  }

  newEntry() {
    const { entries } = store.getState().entries;
    console.log(store.getState());
    this.socket.on('new-entry', (newEntry) => {
      if (!entries.some(entry => entry._id === newEntry._id)) {
        this.dispatch({ type: NEW_ENTRY, json: newEntry });
      }
    });
  }

  deleteEntry() {
    this.socket.on('delete-entry', deletedId => console.log(deletedId));
  }

  newSection() {
    const { sections } = store.getState().sections;
    this.socket.on('new-section', (newSection) => {
      if (!sections.some(section => section._id === newSection._id)) {
        this.dispatch({ type: NEW_SECTION, newSection });
      }
    });
  }

  deleteSection() {
    this.socket.on('delete-section', deletedId => console.log(deletedId));
  }

  listen() {
    this.newField();

    this.newEntry();
    this.deleteEntry();

    this.newSection();
    this.deleteSection();
  }
}
