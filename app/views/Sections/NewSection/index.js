import React, { Component, PropTypes } from 'react';
import serialize from 'form-serialize';
import { newSection } from '../../../actions/sectionActions';
import Page from '../../../containers/Page';
import FieldLayout from '../../../containers/FieldLayout';
import Input from '../../../components/Input';
import TitleBar from '../../../components/TitleBar';
import Button from '../../../components/Button';
import { slugify } from '../../../utils/helpers';
import t from '../../../utils/types';

export default class NewSection extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    fields: t.fields.isRequired,
  }

  static defaultProps = {
    dispatch: null,
  }

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
  }

  state = { fields: [], title: '' }

  handleSubmit(e) {
    e.preventDefault();
    const data = serialize(this.page.form, { hash: true });
    this.props.dispatch(newSection(data));
  }

  handleTitleChange(title) {
    this.setState({ title });
  }

  render() {
    const { fields } = this.props.fields;
    const activeFields = fields.filter(f => this.state.fields.findIndex(i => f._id === i) !== -1);

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
              name="slug"
              label="Section Slug"
              instructions="You can use this slug to reference this specific entry in a template."
              required
              full
              code
              disabled
              value={slugify(this.state.title)}
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
              activeFields={activeFields}
              fields={fields}
              ref={(r) => { this.fieldLayout = r; }}
            />
          </div>
        </div>
      </Page>
    );
  }
}
