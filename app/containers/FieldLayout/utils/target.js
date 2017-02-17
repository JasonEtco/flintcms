const target = {
  canDrop() {
    return true;
  },

  hover(props, monitor, component) {
    if (!component.targ) return;

    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) return;

    // Determine rectangle on screen
    const hoverBoundingRect = component.targ.getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%
    if (hoverClientY < hoverMiddleY) {
      component.setState({ hoverPosition: 1 });
    }
    if (hoverClientY > hoverMiddleY) {
      component.setState({ hoverPosition: -1 });
    }

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    monitor.getItem().index = hoverIndex; // eslint-disable-line no-param-reassign
  },

  drop(props, monitor, component) {
    if (monitor.didDrop()) return;

    // Obtain the dragged item
    const item = monitor.getItem();
    const { index } = item;
    const { index: hoverIndex } = item.props;
    const position = component.state.hoverPosition;

    component.setState({
      hasDropped: true,
      hoverPosition: 0,
    });

    if (!monitor.didDrop() && index === undefined && item.props.new) {
      component.props.addField(item.props.field, position === -1 ? hoverIndex + 1 : hoverIndex);
      return;
    }

    if (hoverIndex === undefined) {
      return;
    }

    if (!monitor.didDrop() && !item.props.new) {
      component.props.sortField(index, hoverIndex);
    }
  },
};

export default target;
