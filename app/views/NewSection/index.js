import React, { Component, PropTypes } from 'react';
import { newSection } from '../../actions/sectionActions';
import Page from '../../containers/Page';
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

  componentDidMount() {
    fetch('/admin/api/templates', {
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => new Error(err));
  }

  handleSubmit(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(newSection(this.title.value, this.template.value, this.state.fields));
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

    return (
      <Page name="new-section">
        <TitleBar title="New Section">
          <Button onClick={this.handleSubmit} small>Save</Button>
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

              {fields.map(f => (
                <label htmlFor={f._id} key={f._id}>
                  {f.title}
                  <input type="checkbox" value={f._id} id={f._id} onChange={() => this.toggleField(f._id)} />
                </label>
              ))}
            </form>
          </div>
        </div>
      </Page>
    );
  }
}
