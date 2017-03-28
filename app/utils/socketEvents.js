import React from 'react';
import { NEW_SECTION, DELETE_SECTION, UPDATE_SECTION } from '../actions/sectionActions';
import { NEW_ENTRY, DELETE_ENTRY, UPDATE_ENTRY } from '../actions/entryActions';
import { NEW_FIELD, DELETE_FIELD, UPDATE_FIELD } from '../actions/fieldActions';
import { NEW_ASSET, DELETE_ASSET } from '../actions/assetActions';
import { NEW_USERGROUP, DELETE_USERGROUP } from '../actions/usergroupActions';
import { newToast } from '../actions/uiActions';
import store from './store';

export default class SocketEvents {
  constructor(socket, dispatch) {
    this.dispatch = dispatch;
    this.socket = socket;
  }

  newField() {
    this.socket.on('new-field', (addField) => {
      this.dispatch({ type: NEW_FIELD, addField });
      this.dispatch(newToast(<span><b>{addField.title}</b> was just added!</span>));
    });
  }

  updateField() {
    this.socket.on('update-field', (updatedField) => {
      this.dispatch({ type: UPDATE_FIELD, updatedField });
      this.dispatch(newToast(<span><b>{updatedField.title}</b> was just added!</span>));
    });
  }

  deleteField() {
    this.socket.on('delete-field', ({ _id }) => {
      this.dispatch({ type: DELETE_FIELD, id: _id });
      this.dispatch(newToast('A field was just deleted.'));
    });
  }

  newAsset() {
    this.socket.on('new-asset', (addAsset) => {
      this.dispatch({ type: NEW_ASSET, addAsset });
      this.dispatch(newToast(<span><b>{addAsset.title}</b> was just added!</span>));
    });
  }

  deleteAsset() {
    this.socket.on('delete-asset', ({ _id }) => {
      this.dispatch({ type: DELETE_ASSET, id: _id });
      this.dispatch(newToast('An asset was just deleted.'));
    });
  }

  newEntry() {
    this.socket.on('new-entry', (addEntry) => {
      this.dispatch({ type: NEW_ENTRY, addEntry });
      this.dispatch(newToast(<span><b>{addEntry.title}</b> was just added!</span>));
    });
  }

  updateEntry() {
    this.socket.on('update-entry', (updateEntry) => {
      this.dispatch({ type: UPDATE_ENTRY, updateEntry });
      this.dispatch(newToast(<span><b>{updateEntry.title}</b> was just updated!</span>));
    });
  }

  deleteEntry() {
    this.socket.on('delete-entry', ({ _id, title }) => {
      this.dispatch({ type: DELETE_ENTRY, id: _id });
      this.dispatch(newToast(<span><b>{title}</b> has been deleted.</span>));
    });
  }

  newUserGroup() {
    this.socket.on('new-usergroup', (addUserGroup) => {
      this.dispatch({ type: NEW_USERGROUP, addUserGroup });
      this.dispatch(newToast(<span><b>{addUserGroup.title}</b> was just added!</span>));
    });
  }

  deleteUserGroup() {
    this.socket.on('delete-usergroup', ({ _id, title }) => {
      this.dispatch({ type: DELETE_USERGROUP, id: _id });
      this.dispatch(newToast(<span><b>{title}</b> has been deleted.</span>));
    });
  }

  newSection() {
    this.socket.on('new-section', (addSection) => {
      this.dispatch({ type: NEW_SECTION, addSection });
      this.dispatch(newToast(<span><b>{addSection.title}</b> was just added!</span>));
    });
  }

  updateSection() {
    this.socket.on('update-section', (updateSection) => {
      this.dispatch({ type: UPDATE_SECTION, updateSection });
      this.dispatch(newToast(<span><b>{updateSection.title}</b> was just updated!</span>));
    });
  }

  deleteSection() {
    this.socket.on('delete-section', ({ _id }) => {
      const { entries } = store.getState();

      entries.entries
        .filter(e => e.section === _id)
        .forEach(e => this.dispatch({ type: DELETE_ENTRY, _id: e._id }));

      this.dispatch({ type: DELETE_SECTION, _id });
      this.dispatch(newToast('An section was just deleted.'));
    });
  }

  listen() {
    // Listen for new or deleted Fields
    this.newField();
    this.updateField();
    this.deleteField();

    // Listen for new or deleted Entries
    this.newEntry();
    this.updateEntry();
    this.deleteEntry();

    // Listen for new or deleted User Groups
    this.newUserGroup();
    this.deleteUserGroup();

    // Listen for new or deleted Sections
    this.newSection();
    this.updateSection();
    this.deleteSection();

    // Listen for new or deleted Assets
    this.newAsset();
    this.deleteAsset();
  }
}
