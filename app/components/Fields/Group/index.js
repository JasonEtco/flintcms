import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import renderOption from 'utils/renderOption';
import Icon from 'utils/icons';
import DeleteIcon from 'components/DeleteIcon';
import DraggableList from 'react-draggable-list';
import './Group.scss';


class GroupRow extends Component {
  static propTypes = {
    item: PropTypes.shape({
      fields: PropTypes.array.isRequired,
      key: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
    }).isRequired,
    dragHandle: PropTypes.func.isRequired,
    commonProps: PropTypes.shape({
      name: PropTypes.string.isRequired,
      deleteBlock: PropTypes.func.isRequired,
    }).isRequired,
  }

  render() {
    const { dragHandle, item, commonProps } = this.props;
    const { name, deleteBlock } = commonProps;

    return (
      <div key={item.key} className="group__block form-element">
        <div className="group__block__btns">
          {dragHandle(<button className="group__drag"><Icon icon="dragVertical" /></button>)}
          <DeleteIcon onClick={() => deleteBlock(this.props.item.key)} small />
        </div>
        {item.fields.map(field => renderOption(field, field.defaultValue || null, { name: `${name}[${item.order}][${field.handle}]`, key: `${name}[${item.order}][${field.handle}]` }))}
        <input type="text" name={`${name}[${item.order}][type]`} value={item.type} hidden readOnly />
      </div>
    );
  }
}


export default class Group extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    required: PropTypes.bool,
    instructions: PropTypes.string,
    blocks: PropTypes.objectOf(PropTypes.shape({
      fields: PropTypes.arrayOf(PropTypes.shape({
        handle: PropTypes.string,
        title: PropTypes.string,
        type: PropTypes.string,
        instructions: PropTypes.string,
      })),
    })).isRequired,
    defaultValue: PropTypes.array,
  }

  static defaultProps = {
    instructions: null,
    required: false,
    defaultValue: [],
  }

  constructor(props) {
    super(props);

    const formattedFields = props.defaultValue.map((blockObj, i) => {
      const { type, ...fields } = blockObj;
      const block = props.blocks[type];
      const formatted = block.fields.map(f => ({
        ...f,
        defaultValue: fields[f.handle],
      }));

      return {
        ...block,
        key: i,
        order: i,
        type,
        fields: formatted,
      };
    });

    this.addBlock = this.addBlock.bind(this);
    this.deleteBlock = this.deleteBlock.bind(this);

    this.state = { blocks: formattedFields };
  }

  onListChange(blocks) {
    const newBlocks = Array(blocks.length);
    // eslint-disable-next-line
    blocks.map((block, i) => {
      newBlocks[i] = { ...block, order: i };
    });

    this.setState({ blocks: newBlocks });
  }

  addBlock(key) {
    this.setState({
      blocks: [
        ...this.state.blocks,
        {
          type: key,
          order: this.state.blocks.length,
          key: this.state.blocks.length,
          ...this.props.blocks[key],
        },
      ],
    });
  }

  deleteBlock(index) {
    const { blocks } = this.state;
    this.setState({
      blocks: [
        ...blocks.slice(0, index),
        ...blocks.slice(index + 1),
      ],
    });
  }

  render() {
    const { required, name, instructions, label, blocks } = this.props;

    const classes = classnames(
      'group-wrapper',
      'form-element',
      { 'form-element--required': required },
    );

    const common = { ...this.props, deleteBlock: this.deleteBlock };

    /* eslint-disable react/no-array-index-key */
    return (
      <div className={classes}>
        {label && <label className="input__label" htmlFor={name}>{label}</label>}
        {instructions && <p className="input__instructions">{instructions}</p>}
        <div className="group__fields form-element">
          <DraggableList
            list={this.state.blocks}
            itemKey="key"
            template={GroupRow}
            onMoveEnd={newList => this.onListChange(newList)}
            container={() => document.body}
            commonProps={common}
          />
        </div>
        <div className={`group__buttons ${this.state.blocks.length > 0 ? 'form-element' : ''}`}>
          {Object.keys(blocks).map(blk => <button key={blk} type="button" className="group__buttons__btn" onClick={() => this.addBlock(blk)}>{blk}</button>)}
        </div>
      </div>
    );
  }
}
