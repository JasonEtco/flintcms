import React, { Component } from 'react';
import PropTypes from 'prop-types';
import serialize from 'form-serialize';
import { newUserGroup } from 'actions/usergroupActions';
import Page from 'containers/Page';
import Input from 'components/Input';
import TitleBar from 'components/TitleBar';
import Button from 'components/Button';
import Checkboxes from 'components/Checkbox/Checkboxes';
import { capitalize } from 'utils/helpers';
import permissions from '../../../../server/utils/permissions.json';

export default class NewUserGroup extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
  }

  static defaultProps = {
    dispatch: null,
  }

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
  }

  state = { title: '' }

  handleSubmit(e) {
    e.preventDefault();
    const data = serialize(this.page.form, { hash: true, empty: true });
    this.props.dispatch(newUserGroup(data));
  }

  handleTitleChange(title) {
    this.setState({ title });
  }

  render() {
    const links = [
      { label: 'Settings', path: '/settings' },
      { label: 'User Groups', path: '/settings/usergroups' },
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

            {Object.keys(permissions).map(key => <Checkboxes key={key} label={capitalize(key)} checkboxes={permissions[key]} name={`permissions[${key}]`} />)}
          </div>
        </div>
      </Page>
    );
  }
}
