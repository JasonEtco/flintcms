import React, { Component, PropTypes } from 'react';
import Page from '../../containers/Page';
import FieldLayout from '../../containers/FieldLayout';
import Input from '../../components/Input';
import TitleBar from '../../components/TitleBar';
import Button from '../../components/Button';
import h from '../../utils/helpers';

export default class Section extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    fields: PropTypes.object,
    sections: PropTypes.object,
    params: PropTypes.object.isRequired,
  }

  static defaultProps = {
    dispatch: null,
    fields: null,
    sections: null,
  }

  constructor(props) {
    super(props);

    const { sections, params } = props;
    const { slug } = params;
    this.section = sections.sections.find(e => e.slug === slug);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleField = this.toggleField.bind(this);

    this.state = { fields: this.section.fields, title: '' };
  }

  handleSubmit(e) {
    e.preventDefault();
    const { dispatch } = this.props; // eslint-disable-line
    // TODO: Change to updateSection
    // dispatch(updateSection(this.title.value, this.template.value, this.state.fields));
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
      <Page name="section">
        <TitleBar title={this.section.title}>
          <Button onClick={this.handleSubmit} small>Save Section</Button>
        </TitleBar>
        <div className="content">
          <div className="page__inner">
            <form onSubmit={this.handleSubmit} ref={(r) => { this.form = r; }}>
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
                instructions="You can use this handle to reference this specific entry in a template."
                ref={(r) => { this.handle = r; }}
                required
                full
                code
                disabled
                value={h.slugify(this.section.slug)}
              />

              <Input
                name="template"
                label="Template"
                instructions="This is a route to the template you want to use, relative to the configured `templates` folder. Does not need to end in `.hbs`."
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
            </form>
          </div>
        </div>
      </Page>
    );
  }
}
