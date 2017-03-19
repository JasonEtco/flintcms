import React, { Component, PropTypes } from 'react';
import serialize from 'form-serialize';
import Page from '../../containers/Page';
import Input from '../../components/Input';
import TitleBar from '../../components/TitleBar';
import Button from '../../components/Button';
import Checkboxes from '../../components/Checkbox/Checkboxes';
import { updateUserGroup } from '../../actions/usergroupActions';
import permissions from '../../utils/permissions';

export default class UserGroup extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    usergroups: PropTypes.object,
    params: PropTypes.object.isRequired,
  }

  static defaultProps = {
    dispatch: null,
    fields: null,
    usergroups: null,
  }

  constructor(props) {
    super(props);

    const { usergroups, params } = props;
    const { slug } = params;
    this.usergroup = usergroups.usergroups.find(e => e.slug === slug);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    const data = serialize(this.page.form, { hash: true });
    dispatch(updateUserGroup(this.usergroup._id, data));
  }

  render() {
    const { usergroups, params } = this.props;
    const { slug } = params;
    const groupPerms = usergroups.usergroups.find(g => g.slug === slug).permissions;

    const { sections, entries, users, fields } = Object.keys(permissions).reduce((prev, curr) => ({
      ...prev,
      [curr]: permissions[curr]
        .map(perm => ({ ...perm, defaultValue: groupPerms[curr][perm.name] })),
    }), {});

    return (
      <Page name="usergroup" onSubmit={this.handleSubmit} ref={(r) => { this.page = r; }}>
        <TitleBar title={this.usergroup.title}>
          <Button type="submit" small>Save User Group</Button>
        </TitleBar>
        <div className="content">
          <div className="page__inner">
            <Input
              name="title"
              label="Title"
              ref={(r) => { this.title = r; }}
              required
              full
              defaultValue={this.usergroup.title}
            />

            <Checkboxes label="Sections" checkboxes={sections} name="permissions[sections]" />
            <Checkboxes label="Entries" checkboxes={entries} name="permissions[entries]" />
            <Checkboxes label="Users" checkboxes={users} name="permissions[users]" />
            <Checkboxes label="Fields" checkboxes={fields} name="permissions[fields]" />
          </div>
        </div>
      </Page>
    );
  }
}
