import React, { Component, PropTypes } from 'react';
import { DropTarget, DragSource } from 'react-dnd';
import target from './utils/target';
import source from './utils/source';
import { collectTarget, collectSource } from './utils/collect';
import c from './utils/constants';
import Icon from '../../utils/icons';

class FieldTargetCard extends Component {
  static propTypes = {
    isOver: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    removeField: PropTypes.func.isRequired,
    sortField: PropTypes.func.isRequired,
    canDrop: PropTypes.bool.isRequired,
    field: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
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
      connectDragSource,
      removeField,
      field,
      index: i,
    } = this.props;

    return connectDragSource(connectDropTarget(
      <div ref={(r) => { this.targ = r; }} key={field._id} className="field-layout__target__field">
        <h4 className="field-layout__target__field__title">{field.title}</h4>
        <input type="text" name={`fields[${i}]`} value={field._id} readOnly hidden />
        <button
          className="field-layout__target__field__btn"
          type="button"
          onClick={() => removeField(field._id)}
        ><Icon icon="cross" width={10} height={10} /></button>
      </div>,
    ));
  }
}

export default DragSource(c.FIELD, source, collectSource)(DropTarget(c.FIELD, target, collectTarget)(FieldTargetCard));
