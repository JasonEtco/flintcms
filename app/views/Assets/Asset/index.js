import React, { Component, PropTypes } from 'react';
import { updateAsset } from '../../../actions/assetActions';
import Page from '../../../containers/Page';
import TitleBar from '../../../components/TitleBar';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import Fields from '../../../components/Fields';
import t from '../../../utils/types';

export default class Asset extends Component {
  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
    assets: t.assets,
    dispatch: PropTypes.func,
  }

  static defaultProps = {
    dispatch: null,
    assets: null,
  }

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    const { id } = this.props.params;
    const { value } = this.title;

    this.props.dispatch(updateAsset({ title: value }, id));
  }

  render() {
    const { assets, params } = this.props;
    const { id } = params;
    const asset = assets.assets.find(e => e._id === id);

    const links = [
      { label: 'Settings', path: '/admin/settings' },
      { label: 'Assets', path: '/admin/settings/assets' },
      { label: asset.title, path: `/admin/settings/assets/${id}` },
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
}
