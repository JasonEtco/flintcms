import React from 'react';
import { NEW_SECTION, DELETE_SECTION } from '../actions/sectionActions';
import { NEW_ENTRY, DELETE_ENTRY } from '../actions/entryActions';
import { NEW_FIELD, DELETE_FIELD } from '../actions/fieldActions';
import { NEW_ASSET, DELETE_ASSET } from '../actions/assetActions';
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
      }
      this.dispatch(newToast(<span><b>{addField.title}</b> was just added!</span>));
    });
  }

  deleteField() {
    this.socket.on('delete-field', ({ _id }) => {
      const { fields } = store.getState().fields;
      if (fields.some(field => field._id === _id)) {
        this.dispatch({ type: DELETE_FIELD, id: _id });
      }
      this.dispatch(newToast('A field was just deleted.'));
    });
  }

  newAsset() {
    this.socket.on('new-asset', (addAsset) => {
      const { assets } = store.getState().assets;
      if (!assets.some(asset => asset._id === addAsset._id)) {
        this.dispatch({ type: NEW_ASSET, addAsset });
      }
      this.dispatch(newToast(<span><b>{addAsset.title}</b> was just added!</span>));
    });
  }

  deleteAsset() {
    this.socket.on('delete-asset', ({ _id }) => {
      const { assets } = store.getState().assets;
      if (assets.some(asset => asset._id === _id)) {
        this.dispatch({ type: DELETE_ASSET, id: _id });
      }
      this.dispatch(newToast('An asset was just deleted.'));
    });
  }

  newEntry() {
    this.socket.on('new-entry', (addEntry) => {
      const { entries } = store.getState().entries;
      if (!entries.some(entry => entry._id === addEntry._id)) {
        this.dispatch({ type: NEW_ENTRY, addEntry });
      }
      this.dispatch(newToast(<span><b>{addEntry.title}</b> was just added!</span>));
    });
  }

  deleteEntry() {
    this.socket.on('delete-entry', ({ _id, title }) => {
      const { entries } = store.getState().entries;
      if (entries.some(entry => entry._id === _id)) {
        this.dispatch({ type: DELETE_ENTRY, id: _id });
      }
      this.dispatch(newToast({
        message: <span><b>{title}</b> has been deleted.</span>,
        style: 'success',
      }));
    });
  }

  newSection() {
    this.socket.on('new-section', (addSection) => {
      const { sections } = store.getState().sections;
      if (!sections.some(section => section._id === addSection._id)) {
        this.dispatch({ type: NEW_SECTION, addSection });
      }
      this.dispatch(newToast(<span><b>{addSection.title}</b> was just added!</span>));
    });
  }

  deleteSection() {
    this.socket.on('delete-section', ({ _id }) => {
      const { sections, entries } = store.getState();

      entries.entries
        .filter(e => e.section === _id)
        .forEach(e => this.dispatch({ type: DELETE_ENTRY, _id: e._id }));

      if (sections.sections.some(section => section._id === _id)) {
        this.dispatch({ type: DELETE_SECTION, _id });
      }
      this.dispatch(newToast('An section was just deleted.'));
    });
  }

  listen() {
    // Listen for new or deleted Fields
    this.newField();
    this.deleteField();

    // Listen for new or deleted Entries
    this.newEntry();
    this.deleteEntry();

    // Listen for new or deleted Sections
    this.newSection();
    this.deleteSection();

    // Listen for new or deleted Assets
    this.newAsset();
    this.deleteAsset();
  }
}
