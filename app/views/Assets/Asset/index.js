import React, { Component, PropTypes } from 'react';
import { updateAsset } from '../../../actions/assetActions';
import Page from '../../../containers/Page';
import TitleBar from '../../../components/TitleBar';
import Input from '../../../components/Input';
import FileInput from '../../../components/FileInput';
import Button from '../../../components/Button';

export default class Asset extends Component {
  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
    assets: PropTypes.object,
    dispatch: PropTypes.func,
  }

  static defaultProps = {
    assets: null,
    dispatch: null,
  }

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    const { id } = this.props.params;

    if (!this.upload.asset.value) {
      // eslint-disable-next-line no-alert
      alert('Please select an image to upload');
    } else if (!this.upload.asset.value.match(/(?:gif|jpg|png|bmp|jpeg)$/)) {
      // eslint-disable-next-line no-alert
      alert('The uploaded file is not an image!');
    } else {
      const formData = new FormData();
      formData.append('title', this.title.value);
      formData.append('file', this.upload.asset.files[0], this.upload.asset.files[0].name);

      this.props.dispatch(updateAsset(formData, id));
    }
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
      <Page name="asset" links={links}>
        <TitleBar title={asset.title}>
          <Button onClick={this.onSubmit} small>Save</Button>
        </TitleBar>
        <div className="content">
          <div className="page__inner">
            <form onSubmit={this.onSubmit} ref={(r) => { this.form = r; }}>
              <Input
                name="title"
                label="Asset Title"
                ref={(r) => { this.title = r; }}
                required
                full
                defaultValue={asset.title}
              />

              <FileInput
                name="asset"
                label="Choose Asset"
                ref={(r) => { this.upload = r; }}
                required
                full
                defaultValue={asset}
              />
            </form>
          </div>
        </div>
      </Page>
    );
  }
}
