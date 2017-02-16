const target = {
  canDrop() {
    return true;
  },

  drop(props, monitor, component) {
    if (monitor.didDrop()) return;

    // Obtain the dragged item
    const item = monitor.getItem();
    component.props.addField(item.props.field._id);
  },
};

export default target;
