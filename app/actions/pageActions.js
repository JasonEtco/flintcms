import React from 'react'
import { push } from 'react-router-redux'
import graphFetcher from 'utils/graphFetcher'
import formatFields from 'utils/formatFields'
import { newToast, errorToasts } from './uiActions'

export const REQUEST_PAGES = 'REQUEST_PAGES'
export const RECEIVE_PAGES = 'RECEIVE_PAGES'
export const NEW_PAGE = 'NEW_PAGE'
export const UPDATE_PAGE = 'UPDATE_PAGE'
export const DELETE_PAGE = 'DELETE_PAGE'
export const PAGE_DETAILS = 'PAGE_DETAILS'

/**
 * Creates a new Page
 * @param {string} title
 * @param {string} section
 * @param {string} status
 * @param {string} dateCreated
 * @param {object} rawOptions
 */
export function newPage ({ title, homepage, template, dateCreated, fields, route }) {
  return async (dispatch) => {
    const query = `mutation ($data: PagesInput!) {
      addPage(data: $data) {
        _id
        title
        slug
        handle
        template
        dateCreated
        homepage
        fieldLayout
        route
        fields {
          fieldId
          handle
          value
        }
      }
    }`

    const variables = {
      data: {
        title,
        homepage,
        template,
        dateCreated,
        route,
        fieldLayout: fields
      }
    }

    return graphFetcher(query, variables)
      .then((json) => {
        const { addPage } = json.data.data

        dispatch({ type: NEW_PAGE, addPage })
        dispatch(newToast({
          message: <span><b>{addPage.title}</b> has been created!</span>,
          style: 'success'
        }))
        dispatch(push(`/pages/${addPage._id}`))
      })
      .catch(errorToasts)
  }
}

const updateQuery = `mutation ($_id: ID!, $data: PagesInput!) {
  updatePage(_id: $_id, data: $data) {
    _id
    title
    template
    slug
    handle
    route
    homepage
    fieldLayout
    fields {
      fieldId
      handle
      value
    }
  }
}`

/**
 * Saves updates of an existing Page
 * @param {string} _id
 * @param {object} data
 */
export function updatePage (_id, data) {
  return async (dispatch, getState) => {
    const state = getState()
    const { title, dateCreated, ...fields } = data
    const options = await formatFields(fields, state.fields.fields)

    const variables = {
      _id,
      data: {
        title,
        dateCreated,
        fields: options
      }
    }

    return graphFetcher(updateQuery, variables)
      .then((json) => {
        const updatedPage = json.data.data.updatePage
        dispatch({ type: UPDATE_PAGE, updatePage: updatedPage })
        dispatch(newToast({
          message: <span><b>{updatedPage.title}</b> has been updated!</span>,
          style: 'success'
        }))
      })
      .catch(errorToasts)
  }
}

/**
 * Saves updates of an existing Page
 * @param {string} _id
 * @param {object} data
 */
export function updatePageSettings (_id, data) {
  return (dispatch) => {
    const { title, fields, dateCreated, route, template, homepage } = data
    const variables = {
      _id,
      data: {
        title,
        fieldLayout: fields,
        dateCreated,
        route,
        template,
        homepage
      }
    }

    return graphFetcher(updateQuery, variables)
      .then((json) => {
        const updatedPage = json.data.data.updatePage
        dispatch({ type: UPDATE_PAGE, updatePage: updatedPage })
        dispatch(newToast({
          message: <span><b>{updatedPage.title}</b> has been updated!</span>,
          style: 'success'
        }))
      })
      .catch(errorToasts)
  }
}

/**
 * Posts to GraphQL to delete an Page
 * @param {string} _id
 * @param {boolean} [redirect=false] - Redirect to the pages page after deleting the page
 */
export function deletePage (_id, redirect = false) {
  return (dispatch) => {
    const query = `mutation ($_id:ID!) {
      removePage(_id: $_id) {
        _id
        title
      }
    }`

    return graphFetcher(query, { _id })
      .then((json) => {
        const { removePage } = json.data.data
        if (redirect) dispatch(push('/pages'))
        dispatch({ type: DELETE_PAGE, id: removePage._id })
        dispatch(newToast({
          message: <span><b>{removePage.title}</b> has been deleted.</span>,
          style: 'success'
        }))
      })
      .catch(errorToasts)
  }
}

/**
 * Gets the details (fields object) of an Page
 * @param {string} _id - Mongo ID of Page.
 */
export function pageDetails (_id) {
  return (dispatch) => {
    const query = `query ($_id:ID!) {
      page (_id: $_id) {
        fields {
          fieldId
          handle
          value
        }
      }
    }`

    return graphFetcher(query, { _id })
      .then((json) => {
        const { page } = json.data.data
        dispatch({ type: UPDATE_PAGE, updatePage: { _id, ...page } })
      })
      .catch(errorToasts)
  }
}
