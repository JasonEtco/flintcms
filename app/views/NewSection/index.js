import React, { Component, PropTypes } from 'react';
import { newSection } from '../../actions/sectionActions';
import Page from '../../containers/Page';
import Input from '../../components/Input';

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
  }

  state = { fields: [] }

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
    dispatch(newSection(this.title.value, this.state.fields));
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
        <form onSubmit={this.handleSubmit}>
          <Input label="Title" name="title" ref={(r) => { this.title = r; }} />

          {fields.map(f => (
            <label htmlFor={f._id} key={f._id}>
              {f.title}
              <input type="checkbox" value={f._id} id={f._id} onChange={() => this.toggleField(f._id)} />
            </label>
          ))}

          <input type="submit" value="Add Section" />
        </form>
      </Page>
    );
  }
}
