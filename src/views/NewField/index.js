import React, { Component, PropTypes } from 'react';
import { newField } from '../../actions/fieldActions';
import Page from '../../containers/Page';
import Fields from '../../components/Fields';
import Input from '../../components/Input';
import Button from '../../components/Button';
import h from '../../utils/helpers';

export default class NewField extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
  }

  static defaultProps = {
    dispatch: f => f,
  }

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.dispatch(newField(this.title.value, this.type.value));
  }

  render() {
    const { Dropdown } = Fields;
    const FieldLabels = Object.keys(Fields).map(f => Fields[f].displayName);
    const options = FieldLabels.map(n => ({ label: n, value: h.slugify(n) }));

    return (
      <Page name="new-field">
        <form onSubmit={this.onSubmit}>
          <Input name="title" placeholder="Title" ref={(r) => { this.title = r; }} />
          <Input name="instructions" placeholder="Instructions" ref={(r) => { this.instructions = r; }} />
          <Input name="handle" placeholder="Template Handle" ref={(r) => { this.handle = r; }} />
          <Dropdown options={options} ref={(r) => { this.type = r; }} />
          <Button type="submit" kind="yes">Add Field</Button>
        </form>
      </Page>
    );
  }
}
