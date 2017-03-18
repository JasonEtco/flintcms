import React, { Component, PropTypes } from 'react';
import serialize from 'form-serialize';
import Page from '../../containers/Page';
import Input from '../../components/Input';
import TitleBar from '../../components/TitleBar';
import Button from '../../components/Button';
import { updateUserGroup } from '../../actions/usergroupActions';

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
    const { title, template, fields } = serialize(this.page.form, { hash: true });
    dispatch(updateUserGroup(this.usergroup._id, title, template, fields));
  }

  render() {
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
          </div>
        </div>
      </Page>
    );
  }
}
