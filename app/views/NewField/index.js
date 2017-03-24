import React, { Component, PropTypes } from 'react';
import { newField } from '../../actions/fieldActions';
import Page from '../../containers/Page';
import Fields from '../../components/Fields';
import Input from '../../components/Input';
import Button from '../../components/Button';
import TitleBar from '../../components/TitleBar';
import { slugify } from '../../utils/helpers';

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
  }

  state = { title: '' }

  onSubmit() {
    const { title, type, instructions } = this;
    this.props.dispatch(newField(title.value, type.value, instructions.value));
  }

  handleTitleChange(title) {
    this.setState({ title });
  }

  render() {
    const { Dropdown } = Fields;
    const FieldLabels = Object.keys(Fields).map(f => Fields[f].displayName);
    const options = FieldLabels.map(n => ({ label: n, value: n }));

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
            <form>
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

              <Dropdown
                options={options}
                label="Field Type"
                instructions="The kind of field presented in the dashboard."
                ref={(r) => { this.type = r; }}
              />
            </form>
          </div>
        </div>
      </Page>
    );
  }
}
