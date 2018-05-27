import React from 'react'
import Fields from 'components/Fields'
import { newToast } from 'actions/uiActions'
import store from './store'

/**
 * Validates an object of field/value pairs using the
 * component class' own validate function.
 * @param {Object} fields - Object of fields
 * @returns {String[]} - An array of field handles
 */
function validateFields (fields) {
  const { dispatch, getState } = store
  const { fields: f } = getState()
  // Validates fields using the appropriate validate method
  const v = Object.keys(fields).filter((fieldHandle) => {
    const { type } = f.fields.find(fld => fld.handle === fieldHandle)
    if (Fields[type].component.validate) {
      return !Fields[type].component.validate(fields[fieldHandle])
    }
    return false
  })

  if (v.length !== 0) {
    v.forEach((invalidField) => {
      const fieldTitle = f.fields.find(fld => fld.handle === invalidField).title
      dispatch(newToast({
        message: <span><strong>{fieldTitle}</strong> received an invalid value.</span>,
        style: 'error'
      }))
    })
    return v
  }

  return []
}

export default validateFields
