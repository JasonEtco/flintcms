import React, { Component, PropTypes } from 'react';
import serialize from 'form-serialize';
import { newField } from '../../actions/fieldActions';
import Page from '../../containers/Page';
import Fields from '../../components/Fields';
import Input from '../../components/Input';
import Button from '../../components/Button';
import TitleBar from '../../components/TitleBar';
import { slugify } from '../../utils/helpers';
import FieldOptions from './FieldOptions';

export default class NewField extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
  }

  static defaultProps = {
    dispatch: null,
  }

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
  }

  state = { title: '', type: 'Dropdown' }

  onSubmit() {
    const data = serialize(this.page.form, { hash: true });
    this.props.dispatch(newField(data));
  }

  handleTitleChange(title) {
    this.setState({ title });
  }

  handleTypeChange(type) {
    this.setState({ type });
  }

  render() {
    const { Dropdown } = Fields;
    const options = Object.keys(Fields).map(n => ({ label: n, value: n }));

    const links = [
      { label: 'Settings', path: '/admin/settings' },
      { label: 'Fields', path: '/admin/settings/fields' },
    ];

    return (
      <Page name="new-field" links={links} onSubmit={this.onSubmit} ref={(r) => { this.page = r; }}>
        <TitleBar title="New Field">
          <Button onClick={this.onSubmit} small>Save</Button>
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

            <Dropdown.component
              name="type"
              options={options}
              label="Field Type"
              onChange={this.handleTypeChange}
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
