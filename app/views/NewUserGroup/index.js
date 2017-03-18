import React, { Component, PropTypes } from 'react';
import serialize from 'form-serialize';
import { newUserGroup } from '../../actions/usergroupActions';
import Page from '../../containers/Page';
import Input from '../../components/Input';
import TitleBar from '../../components/TitleBar';
import Button from '../../components/Button';
import Checkboxes from '../../components/Checkbox/Checkboxes';

const permissions = [
  // Sections
  { name: 'canAddSections', defaultValue: false, label: 'Can Add Sections' },
  { name: 'canDeleteSections', defaultValue: false, label: 'Can Delete Sections' },
  { name: 'canEditSections', defaultValue: false, label: 'Can Edit Sections' },

  // Fields
  { name: 'canAddFields', defaultValue: false, label: 'Can Add Fields' },
  { name: 'canDeleteFields', defaultValue: false, label: 'Can Delete Fields' },
  { name: 'canEditFields', defaultValue: false, label: 'Can Edit Fields' },

  // Entries
  { name: 'canAddEntries', defaultValue: false, label: 'Can Add Entries' },
  { name: 'canDeleteEntries', defaultValue: false, label: 'Can Delete Entries' },
  { name: 'canOnlyEditOwnEntries', defaultValue: false, label: 'Can Only Edit Own Entries' },
  { name: 'canEditLive', defaultValue: false, label: 'Can EditLive' },
  { name: 'canSeeDrafts', defaultValue: false, label: 'Can SeeDrafts' },
  { name: 'canEditDrafts', defaultValue: false, label: 'Can EditDrafts' },
  { name: 'canChangeEntryStatus', defaultValue: false, label: 'Can Change Entry Status' },

  // Users
  { name: 'canManageUsers', defaultValue: false, label: 'Can Manage Users' },
  { name: 'canManageUserGroups', defaultValue: false, label: 'Can Manage User Groups' },
];

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
    const { title, template, fields } = serialize(this.page.form, { hash: true });
    this.props.dispatch(newUserGroup(title, template, fields));
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
        <TitleBar title="New UserGroup">
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

            Permissions

            <Checkboxes checkboxes={permissions} name="permissions" />
          </div>
        </div>
      </Page>
    );
  }
}
