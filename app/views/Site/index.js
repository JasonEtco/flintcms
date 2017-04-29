import React, { Component, PropTypes } from 'react';
import serialize from 'form-serialize';
import Page from '../../containers/Page';
import Input from '../../components/Input';
import Fields from '../../components/Fields';
import Button from '../../components/Button';
import TitleBar from '../../components/TitleBar';
import { updateSite } from '../../actions/siteActions';

export default class Site extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    site: PropTypes.shape({
      siteName: PropTypes.string,
      siteUrl: PropTypes.string,
      siteLogo: PropTypes.object,
    }),
  }
  static defaultProps = {
    dispatch: null,
    site: null,
  }

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const data = serialize(this.page.form, { hash: true });
    this.props.dispatch(updateSite(data));
  }

  render() {
    const { siteName, siteUrl, siteLogo } = this.props.site;
    return (
      <Page name="site-settings" onSubmit={this.handleSubmit} ref={(r) => { this.page = r; }}>
        <TitleBar title="Site Settings">
          <Button small type="submit">Save Changes</Button>
        </TitleBar>
        <div className="content">
          <div className="page__inner">
            <Input label="Site Name" required name="siteName" defaultValue={siteName} full />
            <Input label="Site URL" required name="siteUrl" defaultValue={siteUrl} full />
            <Fields.Asset.component label="Site Logo" name="siteLogo" defaultValue={siteLogo} />
          </div>
        </div>
      </Page>
    );
  }
}
