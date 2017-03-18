import React, { Component, PropTypes } from 'react';
import serialize from 'form-serialize';
import { newUserGroup } from '../../actions/usergroupActions';
import Page from '../../containers/Page';
import Input from '../../components/Input';
import TitleBar from '../../components/TitleBar';
import Button from '../../components/Button';
import Checkbox from '../../components/Checkbox';

const permissions = [
  // Sections
  { name: 'canAddSections', defaultValue: false, label: 'canAddSections' }, 
  { name: 'canDeleteSections', defaultValue: false, label: 'canDeleteSections' }, 
  { name: 'canEditSections', defaultValue: false, label: 'canEditSections' }, 

  // Fields
  { name: 'canAddFields', defaultValue: false, label: 'canAddFields' }, 
  { name: 'canDeleteFields', defaultValue: false, label: 'canDeleteFields' }, 
  { name: 'canEditFields', defaultValue: false, label: 'canEditFields' }, 

  // Entries
  { name: 'canAddEntries', defaultValue: false, label: 'canAddEntries' }, 
  { name: 'canDeleteEntries', defaultValue: false, label: 'canDeleteEntries' }, 
  { name: 'canOnlyEditOwnEntries', defaultValue: false, label: 'canOnlyEditOwnEntries' }, 
  { name: 'canEditLive', defaultValue: false, label: 'canEditLive' }, 
  { name: 'canSeeDrafts', defaultValue: false, label: 'canSeeDrafts' }, 
  { name: 'canEditDrafts', defaultValue: false, label: 'canEditDrafts' }, 
  { name: 'canChangeEntryStatus', defaultValue: false, label: 'canChangeEntryStatus' }, 

  // Users
  { name: 'canManageUsers', defaultValue: false, label: 'canManageUsers' }, 
  { name: 'canManageUserGroups', defaultValue: false, label: 'canManageUserGroups' }, 
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

            {permissions.map(perm => <Checkbox key={perm.name} {...perm} />)}
          </div>
        </div>
      </Page>
    );
  }
}
