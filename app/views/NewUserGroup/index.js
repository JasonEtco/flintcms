import React, { Component, PropTypes } from 'react';
import serialize from 'form-serialize';
import { newUserGroup } from '../../actions/usergroupActions';
import Page from '../../containers/Page';
import Input from '../../components/Input';
import TitleBar from '../../components/TitleBar';
import Button from '../../components/Button';
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

            <Input
              name="handle"
              label="UserGroup Handle"
              instructions="You can use this handle to reference this specific entry in a template."
              ref={(r) => { this.handle = r; }}
              required
              full
              code
              disabled
              value={h.slugify(this.state.title)}
            />
          </div>
        </div>
      </Page>
    );
  }
}
