import React, { Component, PropTypes } from 'react';
import Input from 'components/Input';
import Button from 'components/Button';
import Fields from 'components/Fields';
import FieldOptions from 'components/FieldOptions';
import { slugify } from 'utils/helpers';
import { openModal } from 'actions/uiActions';
import ConfirmModal from 'components/Modals/ConfirmModal';
import serialize from 'form-serialize';

export default class FieldColumn extends Component {
  static propTypes = {
    field: PropTypes.object,
    onTitleChange: PropTypes.func.isRequired,
    deleteField: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    canDelete: PropTypes.bool.isRequired,
    save: PropTypes.func.isRequired,
  }

  static defaultProps = {
    field: {
      title: '',
      instructions: '',
      required: false,
      type: 'Asset',
    },
  }

  constructor(props) {
    super(props);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.delete = this.delete.bind(this);

    this.state = {
      title: props.field.title || '',
      type: props.field.type || 'Asset',
      data: props.field,
    };
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.props.save(false);
    }, 100);
  }

  componentWillUnmount() { clearInterval(this.timer); }

  handleTitleChange(title) {
    this.setState({ title }, this.props.onTitleChange(title));
  }

  handleTypeChange(type) {
    this.setState({ type });
  }

  delete() {
    const { deleteField, dispatch } = this.props;
    dispatch(openModal(
      <ConfirmModal
        confirm={deleteField}
        message="Are you sure you want to delete this field?"
      />),
    );
  }

  render() {
    const options = Object.keys(Fields)
      .filter(f => f !== 'Group')
      .map(n => ({ label: n, value: n }));
    const { Dropdown, Toggle } = Fields;

    const { field, canDelete } = this.props;

    return (
      <form className="group__col__inner" ref={(r) => { this.form = r; }}>
        <Input
          name="title"
          label="Title"
          instructions="This is what the field will be called in the admin dashboard."
          ref={(r) => { this.title = r; }}
          required
          full
          defaultValue={field.title}
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
          defaultValue={field.instructions}
          full
        />

        <Toggle.component
          name="required"
          label="Required"
          instructions="Should this field be required?"
          defaultValue={field.required}
        />

        <Dropdown.component
          name="type"
          options={options}
          label="Field Type"
          onChange={this.handleTypeChange}
          alphabetize
          instructions="The kind of field presented in the dashboard."
          ref={(r) => { this.type = r; }}
          defaultValue={field.type}
        />

        <FieldOptions
          type={this.state.type}
          onChange={this.updateField}
          fields={Fields}
        />

        {canDelete && <Button small kind="subtle" className="group__delete" onClick={this.delete}>Delete</Button>}
      </form>
    );
  }
}
