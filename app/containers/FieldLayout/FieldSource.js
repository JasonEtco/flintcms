import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import classnames from 'classnames';
import source from './utils/source';
import { collectSource } from './utils/collect';
import c from './utils/constants';

class FieldSource extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    field: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
  }

  static defaultProps = {
    disabled: false,
  }

  render() {
    const { isDragging, connectDragSource, field, disabled } = this.props;
    const { title } = field;
    const classes = classnames(
      'field-layout__fields__field',
      { 'is-disabled': disabled },
      { 'is-dragging': isDragging },
    );

    const comp = (
      <div className={classes} style={{ opacity: isDragging || disabled ? 0.5 : 1 }}>
        {title}
      </div>
    );

    return connectDragSource(comp);
  }
}

export default DragSource(c.FIELD, source, collectSource)(FieldSource);
