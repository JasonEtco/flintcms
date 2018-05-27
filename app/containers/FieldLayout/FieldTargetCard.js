import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DropTarget, DragSource } from 'react-dnd'
import Icon from 'utils/icons'
import target from './utils/target'
import source from './utils/source'
import { collectTarget, collectSource } from './utils/collect'
import c from './utils/constants'

class FieldTargetCard extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    removeField: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    field: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired
  }

  render () {
    const {
      isDragging,
      connectDropTarget,
      connectDragSource,
      removeField,
      field,
      index
    } = this.props

    return connectDragSource(connectDropTarget(
      <li ref={(r) => { this.targ = r }} key={field._id} className='field-layout__target__field' style={{ opacity: isDragging ? 0 : 1 }}>
        <span className='field-layout__target__field__title'>{field.title}</span>
        <input type='text' name={`fields[${index}]`} value={field._id} readOnly hidden />
        <button
          className='field-layout__target__field__btn'
          type='button'
          onClick={() => removeField(field._id)}
        ><Icon icon='cross' width={10} height={10} /></button>
      </li>
    ))
  }
}

// eslint-disable-next-line max-len
export default DragSource(c.FIELD, source, collectSource)(DropTarget(c.FIELD, target, collectTarget)(FieldTargetCard))
