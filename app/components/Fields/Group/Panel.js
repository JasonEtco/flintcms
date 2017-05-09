import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import serialize from 'form-serialize';
import { openModal } from 'actions/uiActions';
import update from 'immutability-helper';
import Button from 'components/Button';
import NewBlockModal from './NewBlockModal';
import mapStateToProps from '../../../main';
import FieldColumn from './FieldColumn';

const GroupTile = ({ onClick, label, isActive }) => (
  <button
    type="button"
    onClick={onClick}
    className={`group__col__tile ${isActive ? 'is-active' : ''}`}
  >
    {label}
  </button>
);

GroupTile.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
};

class Panel extends Component {
  static propTypes = {
    blocks: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      handle: PropTypes.string,
      fields: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        handle: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        instructions: PropTypes.string,
        required: PropTypes.bool,
        options: PropTypes.arrayOf(PropTypes.object),
      })),
    })),
    name: PropTypes.string.isRequired,
    dispatch: PropTypes.func,
  }

  static defaultProps = {
    blocks: [],
    dispatch: null,
  }

  constructor(props) {
    super(props);
    this.newBlockType = this.newBlockType.bind(this);
    this.addBlockType = this.addBlockType.bind(this);
    this.changeBlockType = this.changeBlockType.bind(this);
    this.changeField = this.changeField.bind(this);
    this.newField = this.newField.bind(this);

    const currentBlock = props.blocks.length > 0 ? 0 : null;

    this.state = {
      blocks: props.blocks,
      currentBlock,
      currentField: 0,
    };
  }

  addBlockType(block) {
    this.setState({
      blocks: [
        ...this.state.blocks,
        block,
      ],
      currentBlock: this.state.blocks.length,
    });
  }

  newBlockType() {
    this.props.dispatch(openModal(<NewBlockModal confirm={this.addBlockType} />));
  }

  changeBlockType(currentBlock) {
    this.setState({ currentBlock });
  }

  changeField(currentField) {
    const data = serialize(this.fieldColumn.form, { hash: true, empty: true });
    this.fieldColumn.form.reset();
    this.fieldColumn.setState({ title: '' });

    if (!data) return;

    const { blocks, currentBlock } = this.state;
    const index = this.state.currentField;

    this.setState({
      blocks: [
        ...blocks.slice(0, currentBlock),
        {
          ...blocks[currentBlock],
          fields: [
            ...blocks[currentBlock].fields.slice(0, index),
            update(blocks[currentBlock].fields[index], { $merge: { ...data, label: data.title || 'Blank' } }),
            ...blocks[currentBlock].fields.slice(index + 1),
          ],
        },
        ...blocks.slice(currentBlock + 1),
      ],
      currentField,
    });
  }

  newField() {
    const { blocks, currentBlock, currentField } = this.state;
    const block = blocks[currentBlock];
    const field = {
      label: 'Blank',
      handle: `blank-${blocks[currentBlock].fields.length}`,
    };

    this.changeField(currentField);

    this.setState({
      blocks: [
        ...blocks.slice(0, currentBlock),
        {
          ...block,
          fields: [
            ...block.fields,
            ...field,
          ],
        },
        ...blocks.slice(currentBlock + 1),
      ],
      currentField: block.fields.length,
    });
  }

  render() {
    const { currentBlock, currentField, blocks } = this.state;
    const { name: fieldName } = this.props;
    const block = blocks[currentBlock];
    const field = block && block.fields.length > 0
      ? block.fields[currentField]
      : {};

    return (
      <div className="group__panel">
        <div className="group__col">
          <h3 className="group__col__title">Block Types</h3>
          <div className="group__col__inner">
            {blocks.length > 0 && blocks.map(({ handle, name }, i) =>
              <GroupTile
                key={handle}
                isActive={currentBlock === i}
                onClick={() => this.changeBlockType(i)}
                label={name}
              />)}
            <Button small onClick={this.newBlockType}>New Block Type</Button>
          </div>
        </div>

        <div className="group__col">
          <h3 className="group__col__title">Fields</h3>
          <div className="group__col__inner">
            {currentBlock !== null &&
              <div>
                {block.fields.map(({ handle, label }, i) =>
                  <GroupTile
                    key={handle}
                    isActive={currentField === i}
                    onClick={() => this.changeField(i)}
                    label={label}
                  />)}
                <Button small onClick={this.newField}>New Field</Button>
              </div>
            }
          </div>
        </div>

        <div className="group__field-layout">
          <h3 className="group__col__title">Fields</h3>
          {
            currentBlock !== null
            && currentField !== null
            && (
              <FieldColumn
                key={field.handle}
                ref={(r) => { this.fieldColumn = r; }}
                field={field}
              />
            )
          }
        </div>

        <div>
          {blocks.map(b =>
            b.fields.map(f =>
              Object.keys(f).map(key =>
                <input key={key} type="text" hidden readOnly name={`${fieldName}[${block.handle}][${f.handle}]`} value={JSON.stringify(f)} />
              ),
            ),
          )}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Panel);
