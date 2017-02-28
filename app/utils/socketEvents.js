import React from 'react';
import { NEW_SECTION, DELETE_SECTION } from '../actions/sectionActions';
import { NEW_ENTRY, DELETE_ENTRY } from '../actions/entryActions';
import { NEW_FIELD, DELETE_FIELD } from '../actions/fieldActions';
import { newToast } from '../actions/uiActions';
import store from './store';

export default class SocketEvents {
  constructor(socket, dispatch) {
    this.dispatch = dispatch;
    this.socket = socket;
  }

  newField() {
    this.socket.on('new-field', (addField) => {
      const { fields } = store.getState().fields;
      if (!fields.some(field => field._id === addField._id)) {
        this.dispatch({ type: NEW_FIELD, addField });
        this.dispatch(newToast({ message: <span><b>{addField.title}</b> was just added!</span>, style: 'default' }));
      }
    });
  }

  deleteField() {
    this.socket.on('delete-field', ({ _id }) => {
      const { fields } = store.getState().fields;
      if (fields.some(field => field._id === _id)) {
        this.dispatch({ type: DELETE_FIELD, id: _id });
        this.dispatch(newToast({ message: 'A field was just deleted.', style: 'default' }));
      }
    });
  }

  newEntry() {
    this.socket.on('new-entry', (addEntry) => {
      const { entries } = store.getState().entries;
      if (!entries.some(entry => entry._id === addEntry._id)) {
        this.dispatch({ type: NEW_ENTRY, addEntry });
        this.dispatch(newToast({ message: <span><b>{addEntry.title}</b> was just added!</span>, style: 'default' }));
      }
    });
  }

  deleteEntry() {
    this.socket.on('delete-entry', ({ _id, title }) => {
      const { entries } = store.getState().entries;
      if (entries.some(entry => entry._id === _id)) {
        this.dispatch({ type: DELETE_ENTRY, id: _id });
        this.dispatch(newToast({
          message: <span><b>{title}</b> has been deleted.</span>,
          style: 'success',
        }));
      }
    });
  }

  newSection() {
    this.socket.on('new-section', (addSection) => {
      const { sections } = store.getState().sections;
      if (!sections.some(section => section._id === addSection._id)) {
        this.dispatch({ type: NEW_SECTION, addSection });
        this.dispatch(newToast({ message: <span><b>{addSection.title}</b> was just added!</span>, style: 'default' }));
      }
    });
  }

  deleteSection() {
    this.socket.on('delete-section', ({ _id }) => {
      const { sections } = store.getState().sections;
      if (sections.some(section => section._id === _id)) {
        this.dispatch({ type: DELETE_SECTION, _id });
        this.dispatch(newToast({ message: 'An section was just deleted.', style: 'default' }));
      }
    });
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
