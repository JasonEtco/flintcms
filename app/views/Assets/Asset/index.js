import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { updateAsset } from 'actions/assetActions';
import Page from 'containers/Page';
import TitleBar from 'components/TitleBar';
import Input from 'components/Input';
import Button from 'components/Button';
import Fields from 'components/Fields';
import t from 'utils/types';
import { withRouter } from 'react-router';

export default withRouter(class Asset extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    assets: t.assets.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    const { id } = this.props.match.params;
    const { value } = this.title;

    this.props.dispatch(updateAsset({ title: value }, id));
  }

  render() {
    const { assets, match } = this.props;
    const { id } = match.params;
    const asset = assets.assets.find(e => e._id === id);

    const links = [
      { label: 'Settings', path: '/settings' },
      { label: 'Assets', path: '/settings/assets' },
      { label: asset.title, path: `/settings/assets/${id}` },
    ];

    return (
      <Page name="asset" links={links} onSubmit={this.onSubmit}>
        <TitleBar title={asset.title}>
          <Button small type="submit">Save</Button>
        </TitleBar>
        <div className="content">
          <div className="page__inner">
            <Input
              name="title"
              label="Asset Title"
              ref={(r) => { this.title = r; }}
              required
              full
              defaultValue={asset.title}
            />

            <Fields.Asset.component
              label={asset.title}
              name="asset"
              defaultValue={asset}
              readOnly
            />
          </div>
        </div>
      </Page>
    );
  }
});
