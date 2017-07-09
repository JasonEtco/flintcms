import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import renderOption from 'utils/renderOption';
import DeleteIcon from 'components/DeleteIcon';
import './Group.scss';

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

    const formattedFields = props.defaultValue.map((blockObj) => {
      const { type, ...fields } = blockObj;
      const block = props.blocks[type];
      const formatted = block.fields.map(f => ({
        ...f,
        defaultValue: fields[f.handle],
      }));

      return {
        ...block,
        type,
        fields: formatted,
      };
    });

    this.addBlock = this.addBlock.bind(this);
    this.deleteBlock = this.deleteBlock.bind(this);

    this.state = { blocks: formattedFields };
  }

  addBlock(key) {
    this.setState({
      blocks: [
        ...this.state.blocks,
        {
          type: key,
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

    /* eslint-disable react/no-array-index-key */
    return (
      <div className={classes}>
        {label && <label className="input__label" htmlFor={name}>{label}</label>}
        {instructions && <p className="input__instructions">{instructions}</p>}
        <div className="group__fields form-element">
          {this.state.blocks.map((blk, i) => (
            <div key={i} className="group__block form-element">
              <div className="group__block__btns">
                <DeleteIcon onClick={() => this.deleteBlock(i)} small />
              </div>
              {blk.fields.map(field => renderOption(field, field.defaultValue || null, { name: `${name}[${i}][${field.handle}]` }))}
              <input type="text" name={`${name}[${i}][type]`} value={blk.type} hidden readOnly />
            </div>))}
        </div>
        <div className={`group__buttons ${this.state.blocks.length > 0 ? 'form-element' : ''}`}>
          {Object.keys(blocks).map(blk => <button key={blk} type="button" className="group__buttons__btn" onClick={() => this.addBlock(blk)}>{blk}</button>)}
        </div>
      </div>
    );
  }
}
