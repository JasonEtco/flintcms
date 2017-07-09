import React, { Component } from 'react';
import PropTypes from 'prop-types';
import serialize from 'form-serialize';
import { newSection } from 'actions/sectionActions';
import Page from 'containers/Page';
import FieldLayout from 'containers/FieldLayout';
import Input from 'components/Input';
import TitleBar from 'components/TitleBar';
import Button from 'components/Button';
import camelcase from 'utils/camelcase';
import t from 'utils/types';

export default class NewSection extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    fields: t.fields.isRequired,
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
      { label: 'Settings', path: '/settings' },
      { label: 'Sections', path: '/settings/sections' },
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
              instructions="You can use this handle to reference this specific section in a template."
              required
              full
              code
              disabled
              value={camelcase(this.state.title)}
            />

            <Input
              name="template"
              label="Template"
              instructions="This is a route to the template you want to use, relative to the configured `templates` folder. Does not need to end in `.njk`."
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
