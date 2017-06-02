import React from 'react';
import { push } from 'react-router-redux';
import graphFetcher from '../utils/graphFetcher';
import { errorToasts, newToast } from './uiActions';

export const REQUEST_USER = 'REQUEST_USER';
export const RECEIVE_USER = 'RECEIVE_USER';
export const NEW_USER = 'NEW_USER';
export const UPDATE_USER = 'UPDATE_USER';
export const DELETE_USER = 'DELETE_USER';

export const REQUEST_USERS = 'REQUEST_USERS';
export const RECEIVE_USERS = 'RECEIVE_USERS';

/**
 * Adds a new user to the database
 * @param {Object} user
 */
export function newUser(user) {
  return (dispatch) => {
    const query = `mutation ($user: UserInput!) {
      addUser(user: $user) {
        _id
        username
        email
        name {
          first
          last
        }
        dateCreated
        image
        usergroup {
          _id
        }
      }
    }`;

    return graphFetcher(query, { user })
      .then((json) => {
        const { addUser } = json.data.data;
        dispatch({ type: NEW_USER, addUser });
        dispatch(push('/users'));
      })
      .catch(errorToasts);
  };
}

/**
 * Adds a new user to the database
 * @param {String} _id
 */
export function deleteUser(_id) {
  return (dispatch) => {
    const query = `mutation ($_id: ID!) {
      deleteUser(_id: $_id) {
        _id
      }
    }`;

    return graphFetcher(query, { _id })
      .then((json) => {
        const { deleteUser: deletedUser } = json.data.data;
        dispatch({ type: DELETE_USER, deletedUser });
        dispatch(push('/users'));
      })
      .catch(errorToasts);
  };
}

/**
 * Saves updates of an existing User
 * @param {string} _id
 * @param {object} data
 */
export function updateUser(_id, data) {
  return (dispatch) => {
    const query = `mutation ($_id: ID!, $data: UserInput!) {
      updateUser(_id: $_id, data: $data) {
        _id
        username
        email
        name {
          first
          last
        }
        dateCreated
        image
        usergroup {
          _id
        }
      }
    }`;

    return graphFetcher(query, { _id, data })
      .then((json) => {
        const updatedUser = json.data.data.updateUser;
        dispatch({ type: UPDATE_USER, updateUser: updatedUser });
        dispatch(newToast({
          message: <span><b>{updatedUser.username}</b> has been updated!</span>,
          style: 'success',
        }));
      })
      .catch(errorToasts);
  };
}

/**
 * Gets the details of a User
 * @param {string} _id - Mongo ID of User.
 */
export function userDetails(_id) {
  return (dispatch) => {
    const query = `query ($_id:ID!) {
      user (_id: $_id) {
        email
      }
    }`;

    return graphFetcher(query, { _id })
      .then((json) => {
        const { user } = json.data.data;
        dispatch({ type: UPDATE_USER, updateUser: { _id, ...user } });
      })
      .catch(errorToasts);
  };
}

/**
 * Reset a user's password
 * @param {String} _id - Id of the user
 */
export function sendPasswordReset(_id) {
  return (dispatch) => {
    const query = `{
      mutation ($_id: ID!) {
        resetPassword (_id: $_id) {
          _id
        }
      }
    }`;

    return graphFetcher(query, { _id })
      .then(() => {
        dispatch(newToast({
          message: 'Password reset email has been sent.',
          style: 'success',
        }));
      })
      .catch(errorToasts);
  };
}
