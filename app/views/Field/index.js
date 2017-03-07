import React, { Component, PropTypes } from 'react';
import Page from '../../containers/Page';
import Fields from '../../components/Fields';
import Input from '../../components/Input';
import TitleBar from '../../components/TitleBar';

export default class Field extends Component {
  static propTypes = {
    // dispatch: PropTypes.func,
    fields: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  }

  static defaultProps = {
    dispatch: f => f,
  }

  constructor(props) {
    super(props);

    const { fields, params } = props;
    const { id } = params;
    this.field = fields.fields.find(e => e._id === id);
  }

  render() {
    const { Dropdown } = Fields;
    const { slug, title, instructions } = this.field;
    const FieldLabels = Object.keys(Fields).map(f => Fields[f].displayName);
    const options = FieldLabels.map(n => ({ label: n, value: n }));

    const links = [
      { label: 'Settings', path: '/admin/settings' },
      { label: 'Fields', path: '/admin/settings/fields' },
      { label: title, path: this.props.location.pathname },
    ];

    return (
      <Page name="field" links={links}>
        <TitleBar title={title} />

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
                defaultValue={title}
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
                value={slug}
              />

              <Input
                name="instructions"
                label="Instructions"
                instructions="Text that will help the author understand content is being asked for."
                ref={(r) => { this.instructions = r; }}
                full
                defaultValue={instructions}
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
