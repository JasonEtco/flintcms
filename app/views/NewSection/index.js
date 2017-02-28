import React, { Component, PropTypes } from 'react';
import serialize from 'form-serialize';
import { newSection } from '../../actions/sectionActions';
import Page from '../../containers/Page';
import FieldLayout from '../../containers/FieldLayout';
import Input from '../../components/Input';
import TitleBar from '../../components/TitleBar';
import Button from '../../components/Button';
import h from '../../utils/helpers';

export default class NewSection extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    fields: PropTypes.object,
  }

  static defaultProps = {
    dispatch: null,
    fields: null,
  }

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleField = this.toggleField.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
  }

  state = { fields: [], title: '' }

  handleSubmit(e) {
    e.preventDefault();
    const { title, template, fields } = serialize(this.page.form, { hash: true });
    this.props.dispatch(newSection(title, template, fields));
  }

  handleTitleChange(title) {
    this.setState({ title });
  }

  toggleField(id) {
    const { fields } = this.state;
    const index = fields.indexOf(id);
    if (index !== -1) {
      this.setState({ fields: [...fields.slice(0, index), ...fields.slice(index + 1)] });
    } else {
      this.setState({ fields: [...fields, id] });
    }
  }

  render() {
    const { fields } = this.props.fields;
    const links = [
      { label: 'Settings', path: '/admin/settings' },
      { label: 'Sections', path: '/admin/settings/sections' },
    ];

    return (
      <Page name="new-section" links={links} onSubmit={this.handleSubmit} ref={(r) => { this.page = r; }}>
        <TitleBar title="New Section">
          <Button onClick={this.handleSubmit} small type="submit">Save</Button>
        </TitleBar>
        <div className="content">
          <div className="page__inner">
            <Input
              name="title"
              label="Title"
              ref={(r) => { this.title = r; }}
              required
              full
              onChange={this.handleTitleChange}
            />

            <Input
              name="handle"
              label="Section Handle"
              instructions="You can use this handle to reference this specific entry in a template."
              ref={(r) => { this.handle = r; }}
              required
              full
              code
              disabled
              value={h.slugify(this.state.title)}
            />

            <Input
              name="template"
              label="Template"
              instructions="This is a route to the template you want to use, relative to the configured `templates` folder. Does not need to end in `.hbs`."
              ref={(r) => { this.template = r; }}
              required
              full
              code
            />

            <FieldLayout
              activeFields={fields.filter(f => this.state.fields.findIndex(i => f._id === i) !== -1)}
              fields={fields}
              ref={(r) => { this.fieldLayout = r; }}
            />
          </div>
        </div>
      </Page>
    );
  }
}
