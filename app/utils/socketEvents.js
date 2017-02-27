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
    this.socket.on('new-field', (newField) => {
      const { fields } = store.getState().fields;
      if (!fields.some(field => field._id === newField._id)) {
        this.dispatch({ type: NEW_FIELD, json: newField });
      }
    });
  }

  deleteField() {
    this.socket.on('delete-field', deletedId => console.log(deletedId));
  }

  newEntry() {
    this.socket.on('new-entry', (newEntry) => {
      const { entries } = store.getState().entries;
      if (!entries.some(entry => entry._id === newEntry._id)) {
        this.dispatch({ type: NEW_ENTRY, json: newEntry });
      }
    });
  }

  deleteEntry() {
    this.socket.on('delete-entry', deletedId => console.log(deletedId));
  }

  newSection() {
    this.socket.on('new-section', (newSection) => {
      const { sections } = store.getState().sections;
      if (!sections.some(section => section._id === newSection._id)) {
        this.dispatch({ type: NEW_SECTION, newSection });
      }
    });
  }

  deleteSection() {
    this.socket.on('delete-section', deletedId => console.log(deletedId));
  }

  listen() {
    // Listen for new or delete Fields
    this.newField();
    this.deleteField();

    // Listen for new or delete Entries
    this.newEntry();
    this.deleteEntry();

    // Listen for new or delete Sections
    this.newSection();
    this.deleteSection();
  }
}
