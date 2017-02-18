const fieldSource = {
  beginDrag(props) {
    return {
      index: props.index,
      field: props.field,
      isNew: props.isNew,
    };
  },
};

export default fieldSource;
