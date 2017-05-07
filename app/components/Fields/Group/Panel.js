import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { openModal } from 'actions/uiActions';
import Button from 'components/Button';
import Input from 'components/Input';
import FieldOptions from 'components/FieldOptions';
import { slugify } from 'utils/helpers';
import NewBlockModal from './NewBlockModal';
import mapStateToProps from '../../../main';
import Fields from '../index';

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
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.changeBlockType = this.changeBlockType.bind(this);
    this.changeField = this.changeField.bind(this);
    this.newField = this.newField.bind(this);

    const currentBlock = props.blocks.length > 0 ? 0 : null;

    this.state = {
      blocks: props.blocks,
      currentBlock,
      currentField: 0,
      title: '',
      type: null,
    };
  }

  addBlockType(block) {
    this.setState({
      blocks: [
        ...this.state.blocks,
        block,
      ],
    });
  }

  newBlockType() {
    this.props.dispatch(openModal(<NewBlockModal confirm={this.addBlockType} />));
  }

  changeBlockType(currentBlock) {
    this.setState({ currentBlock });
  }

  changeField(currentField) {
    this.setState({ currentField });
  }

  newField() {
    const { blocks, currentBlock } = this.state;
    this.setState({ blocks: [
      ...blocks.slice(0, currentBlock),
      {
        ...blocks[currentBlock],
        fields: [
          ...blocks[currentBlock].fields,
          {
            name: 'Blank',
            handle: 'blank',
            type: 'Asset',
          },
        ],
      },
      ...blocks.slice(currentBlock + 1),
    ] });
  }

  handleTitleChange(title) {
    this.setState({ title });
  }

  handleTypeChange(type) {
    this.setState({ type });
  }

  render() {
    const { currentBlock, currentField, blocks } = this.state;
    const { Dropdown, Toggle } = Fields;
    const options = Object.keys(Fields)
      .filter(f => f !== 'Group')
      .map(n => ({ label: n, value: n }));

    return (
      <div className="group__panel">
        <div className="group__col">
          <h3 className="group__col__title">Block Types</h3>
          <div className="group__col__inner">
            {blocks.length > 0 && blocks.map((block, i) =>
              <GroupTile
                key={block.handle}
                isActive={currentBlock === i}
                onClick={() => this.changeBlockType(i)}
                label={block.name}
              />)}
            <Button small onClick={this.newBlockType}>New Block Type</Button>
          </div>
        </div>

        <div className="group__col">
          <h3 className="group__col__title">Fields</h3>
          <div className="group__col__inner">
            {currentBlock !== null &&
              <div>
                {blocks[currentBlock].fields.length > 0
                ? blocks[currentBlock].fields.map((field, i) =>
                  <GroupTile
                    key={field.handle + i}
                    isActive={currentField === i}
                    onClick={() => this.changeField(i)}
                    label={field.name}
                  />)
                : <GroupTile
                  isActive={currentField === 0}
                  onClick={() => this.changeField(0)}
                  label="Blank"
                />}
                <Button small onClick={this.newField}>New Field</Button>
              </div>
            }
          </div>
        </div>

        <div className="group__field-layout">
          <h3 className="group__col__title">Fields</h3>
          <div className="group__col__inner">
            <Input
              name="title"
              label="Title"
              instructions="This is what the field will be called in the admin dashboard."
              ref={(r) => { this.title = r; }}
              required
              full
              onChange={this.handleTitleChange}
            />

            <Input
              name="handle"
              label="Template Handle"
              instructions="The variable to use in the templates."
              ref={(r) => { this.handle = r; }}
              required
              full
              code
              disabled
              value={slugify(this.state.title)}
            />

            <Input
              name="instructions"
              label="Instructions"
              instructions="Text that will help the author understand content is being asked for."
              ref={(r) => { this.instructions = r; }}
              full
            />

            <Toggle.component
              name="required"
              label="Required"
              instructions="Should this field be required?"
            />

            <Dropdown.component
              name="type"
              options={options}
              label="Field Type"
              onChange={this.handleTypeChange}
              alphabetize
              instructions="The kind of field presented in the dashboard."
              ref={(r) => { this.type = r; }}
            />

            <FieldOptions fields={Fields} type={this.state.type || options[0].label} />

            <Button small kind="subtle" className="group__delete">Delete</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Panel);
