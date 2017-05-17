import React, { Component, PropTypes } from 'react';
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
        type: PropTypes.arrayOf(PropTypes.string),
        instructions: PropTypes.string,
      })),
    })).isRequired,
  }

  static defaultProps = {
    instructions: null,
    required: false,
  }

  constructor(props) {
    super(props);

    console.log(props);

    this.addBlock = this.addBlock.bind(this);
    this.deleteBlock = this.deleteBlock.bind(this);
    // Set default value to show blocks with filled in fields, etc
    this.state = { blocks: [] };
  }

  addBlock(key) {
    this.setState({
      blocks: [
        ...this.state.blocks,
        this.props.blocks[key],
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

    return (
      <div className={classes}>
        {label && <label className="input__label" htmlFor={name}>{label}</label>}
        {instructions && <p className="input__instructions">{instructions}</p>}
        <div className="group__fields form-element">
          {this.state.blocks.map((blk, i) =>
            <div key={blk} className="group__block form-element">
              <div className="group__block__btns">
                <DeleteIcon onClick={() => this.deleteBlock(i)} small />
              </div>
              {blk.fields.map(field => renderOption(field, null, { name: `${name}[${i}][${field.handle}]` }))}
            </div>)}
        </div>
        <div className="group__buttons form-element">
          {Object.keys(blocks).map(blk => <button key={blk} type="button" className="group__buttons__btn" onClick={() => this.addBlock(blk)}>{blk}</button>)}
        </div>
      </div>
    );
  }
}
