import React, { Component, PropTypes } from 'react';
import serialize from 'form-serialize';
import { updateField } from '../../../actions/fieldActions';
import Page from '../../../containers/Page';
import Fields from '../../../components/Fields';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import TitleBar from '../../../components/TitleBar';
import FieldOptions from '../../../components/FieldOptions';

export default class Field extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    fields: PropTypes.object,
    params: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  }

  static defaultProps = {
    dispatch: null,
    fields: null,
  }

  constructor(props) {
    super(props);

    const { fields, params } = props;
    const { id } = params;
    const field = fields.fields.find(e => e._id === id);
    this.state = { type: field.type };

    this.onSubmit = this.onSubmit.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    const { dispatch, params } = this.props;
    const data = serialize(this.page.form, { hash: true });
    dispatch(updateField(params.id, data));
  }

  handleTypeChange(type) {
    this.setState({ type });
  }

  render() {
    const { Dropdown, Toggle } = Fields;
    const { fields, params } = this.props;
    const { slug, title, instructions } = fields.fields.find(e => e._id === params.id);
    const options = Object.keys(Fields).map(n => ({ label: n, value: n }));

    const links = [
      { label: 'Settings', path: '/admin/settings' },
      { label: 'Fields', path: '/admin/settings/fields' },
      { label: title, path: this.props.location.pathname },
    ];

    return (
      <Page name="field" links={links} onSubmit={this.onSubmit} ref={(r) => { this.page = r; }}>
        <TitleBar title={title}>
          <Button onClick={this.onSubmit} type="submit" small>Save Changes</Button>
        </TitleBar>

        <div className="content">
          <div className="page__inner">
            <Input
              name="title"
              label="Title"
              instructions="This is what the field will be called in the admin dashboard."
              ref={(r) => { this.title = r; }}
              required
              full
              defaultValue={title}
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
              value={slug}
            />

            <Input
              name="instructions"
              label="Instructions"
              instructions="Text that will help the author understand content is being asked for."
              ref={(r) => { this.instructions = r; }}
              full
              defaultValue={instructions}
            />

            <Toggle.component
              name="required"
              label="Required"
              instructions="Should this field be required?"
            />

            <Dropdown.component
              name="type"
              options={options}
              onChange={this.handleTypeChange}
              label="Field Type"
              defaultValue={this.state.type}
              instructions="The kind of field presented in the dashboard."
              ref={(r) => { this.type = r; }}
            />

            <FieldOptions fields={Fields} type={this.state.type} />
          </div>
        </div>
      </Page>
    );
  }
}
