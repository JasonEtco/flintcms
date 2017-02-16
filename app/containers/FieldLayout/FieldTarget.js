import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
import classnames from 'classnames';
import target from './utils/target';
import { collectTarget } from './utils/collect';
import c from './utils/constants';
import FieldTargetCard from './FIeldTargetCard';

class FieldTarget extends Component {
  static propTypes = {
    isOver: PropTypes.bool.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    removeField: PropTypes.func.isRequired,
    sortField: PropTypes.func.isRequired,
    canDrop: PropTypes.bool.isRequired,
    fields: PropTypes.array.isRequired,
    hoverPosition: PropTypes.number,
  }

  static defaultProps = {
    hoverPosition: 0,
  }

  state = { hoverPosition: 0 }

  render() {
    const {
      isOver,
      canDrop,
      connectDropTarget,
      fields,
      removeField,
      sortField,
    } = this.props;

    const classes = classnames(
      'field-layout__target',
      { 'can-drop': isOver && canDrop },
    );

    return connectDropTarget(
      <div className={classes}>
        {fields.map((field, i) =>
          <FieldTargetCard
            key={field._id}
            field={field}
            index={i}
            removeField={removeField}
            sortField={sortField}
          />
        )}
      </div>,
    );
  }
}

export default DropTarget(c.FIELD, target, collectTarget)(FieldTarget);
