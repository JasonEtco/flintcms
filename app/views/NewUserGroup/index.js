import React, { Component, PropTypes } from 'react';
import serialize from 'form-serialize';
import { newUserGroup } from '../../actions/usergroupActions';
import Page from '../../containers/Page';
import Input from '../../components/Input';
import TitleBar from '../../components/TitleBar';
import Button from '../../components/Button';
import Checkboxes from '../../components/Checkbox/Checkboxes';
import permissions from '../../utils/permissions';
import h from '../../utils/helpers';

export default class NewUserGroup extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
  }

  static defaultProps = {
    dispatch: null,
    fields: null,
  }

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
  }

  state = { title: '' }

  handleSubmit(e) {
    e.preventDefault();
    const data = serialize(this.page.form, { hash: true });
    this.props.dispatch(newUserGroup(data));
  }

  handleTitleChange(title) {
    this.setState({ title });
  }

  render() {
    const links = [
      { label: 'Settings', path: '/admin/settings' },
      { label: 'User Groups', path: '/admin/settings/usergroups' },
    ];

    return (
      <Page name="new-usergroup" links={links} onSubmit={this.handleSubmit} ref={(r) => { this.page = r; }}>
        <TitleBar title="New User Group">
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
              label="User Group slug"
              instructions="You can use this slug to reference this specific entry in a template."
              ref={(r) => { this.slug = r; }}
              required
              full
              code
              disabled
              value={h.slugify(this.state.title)}
            />

            <Checkboxes label="Sections" checkboxes={permissions.sections} name="permissions[sections]" />
            <Checkboxes label="Entries" checkboxes={permissions.entries} name="permissions[entries]" />
            <Checkboxes label="Users" checkboxes={permissions.users} name="permissions[users]" />
            <Checkboxes label="Fields" checkboxes={permissions.fields} name="permissions[fields]" />
          </div>
        </div>
      </Page>
    );
  }
}
