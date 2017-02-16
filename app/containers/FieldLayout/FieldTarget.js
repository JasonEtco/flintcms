import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
import classnames from 'classnames';
import target from './utils/target';
import { collectTarget } from './utils/collect';
import c from './utils/constants';
import Icon from '../../utils/icons';

class FieldTarget extends Component {
  static propTypes = {
    isOver: PropTypes.bool.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    removeField: PropTypes.func.isRequired,
    canDrop: PropTypes.bool.isRequired,
    fields: PropTypes.array.isRequired,
  }

  render() {
    const { isOver, canDrop, connectDropTarget, fields, removeField } = this.props;

    const classes = classnames(
      'field-layout__target',
      { 'can-drop': isOver && canDrop },
    );

    return connectDropTarget(
      <div className={classes}>
        {fields.map((field, i) =>
          <div key={field._id} className="field-layout__target__field">
            <h4 className="field-layout__target__field__title">{field.title}</h4>
            <input type="text" name={`fields[${i}]`} value={field._id} readOnly hidden />
            <button
              className="field-layout__target__field__btn"
              type="button"
              onClick={() => removeField(field._id)}
            ><Icon icon="cross" width={10} height={10} /></button>
          </div>,
        )}
      </div>,
    );
  }
}

export default DropTarget(c.FIELD, target, collectTarget)(FieldTarget);
