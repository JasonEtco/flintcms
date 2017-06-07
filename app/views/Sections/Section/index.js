import React, { Component } from 'react';
import PropTypes from 'prop-types';
import serialize from 'form-serialize';
import Page from 'containers/Page';
import FieldLayout from 'containers/FieldLayout';
import Input from 'components/Input';
import TitleBar from 'components/TitleBar';
import Button from 'components/Button';
import { updateSection } from 'actions/sectionActions';
import t from 'utils/types';
import { withRouter } from 'react-router';

export default withRouter(class Section extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    fields: t.fields.isRequired,
    sections: t.sections.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        slug: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }

  constructor(props) {
    super(props);

    const { sections, match } = props;
    const { slug } = match.params;
    this.section = sections.sections.find(e => e.slug === slug);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleField = this.toggleField.bind(this);

    this.state = { fields: this.section.fields, title: '' };
  }

  handleSubmit(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    const data = serialize(this.page.form, { hash: true });
    dispatch(updateSection(this.section._id, data));
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
    const activeFields = fields.filter(f => this.state.fields.findIndex(i => f._id === i) !== -1);

    return (
      <Page name="section" onSubmit={this.handleSubmit} ref={(r) => { this.page = r; }}>
        <TitleBar title={this.section.title}>
          <Button type="submit" small>Save Section</Button>
        </TitleBar>
        <div className="content">
          <div className="page__inner">
            <Input
              name="title"
              label="Title"
              ref={(r) => { this.title = r; }}
              required
              full
              defaultValue={this.section.title}
            />

            <Input
              name="handle"
              label="Section Handle"
              instructions="You can use this handle to reference this specific section in a template."
              required
              full
              code
              disableds
              value={this.section.handle}
            />

            <Input
              name="template"
              label="Template"
              instructions="This is a route to the template you want to use, relative to the configured `templates` folder. Does not need to end in `.njk`."
              ref={(r) => { this.template = r; }}
              required
              full
              code
              defaultValue={this.section.template}
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
});
