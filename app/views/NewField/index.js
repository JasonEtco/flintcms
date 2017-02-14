import React, { Component, PropTypes } from 'react';
import { newField } from '../../actions/fieldActions';
import Page from '../../containers/Page';
import Fields from '../../components/Fields';
import Input from '../../components/Input';
import Button from '../../components/Button';
import TitleBar from '../../components/TitleBar';
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

    const links = [
      { label: 'Settings', path: '/admin/settings' },
      { label: 'Fields', path: '/admin/settings/fields' },
    ];

    return (
      <Page name="new-field" links={links}>
        <TitleBar title="New Field">
          <Button>Save</Button>
        </TitleBar>

        <div className="content">
          <div className="page__inner">
            <form onSubmit={this.onSubmit}>
              <Input
                name="title"
                label="Title"
                placeholder="Title"
                instructions="This is what the field will be called in the admin dashboard."
                ref={(r) => { this.title = r; }}
                required
                full
              />

              <Input
                name="handle"
                label="Template Handle"
                placeholder="Template Handle"
                instructions="The variable to use in the templates."
                ref={(r) => { this.handle = r; }}
                required
                full
              />

              <Input
                name="instructions"
                label="Instructions"
                placeholder="Instructions"
                instructions="Text that will help the author understand content is being asked for."
                ref={(r) => { this.instructions = r; }}
                full
              />
              <Dropdown options={options} ref={(r) => { this.type = r; }} />
              <Button type="submit" kind="yes">Add Field</Button>
            </form>
          </div>
        </div>
      </Page>
    );
  }
}
