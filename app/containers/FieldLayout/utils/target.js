const target = {
  canDrop() {
    return true;
  },

  hover(props, monitor, component) {
    const item = monitor.getItem();
    if (!component.targ || item.isNew) return;

    const dragIndex = item.index;
    const hoverIndex = props.index;

    if (dragIndex === hoverIndex) return;

    const hoverBoundingRect = component.targ.getBoundingClientRect();
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

    component.props.sortField(dragIndex, hoverIndex);

    item.index = hoverIndex; // eslint-disable-line no-param-reassign
  },

  drop(props, monitor, component) {
    const item = monitor.getItem();
    if (item.isNew && component.props.addField) {
      component.props.addField(item.field, monitor.getItem().index);
    }
  },
};

export default target;
