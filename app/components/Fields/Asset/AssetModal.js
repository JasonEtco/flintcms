import React, { Component, PropTypes } from 'react';

const AssetTile = ({ asset, isActive }) => (
  <div className={isActive ? 'asset__tile is-active' : 'asset__tile'}>
    <img src={`/public/assets/${asset.filename}`} alt={asset.title} />
  </div>
);
AssetTile.propTypes = {
  asset: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
};

export default class AssetModal extends Component {
  static propTypes = {
    assets: PropTypes.arrayOf(PropTypes.object),
    onSelect: PropTypes.func.isRequired,
  }

  static defaultProps = {
    assets: [],
  }

  state = { value: null }

  render() {
    const { assets, onSelect } = this.props;
    const { value } = this.state;

    return (
      <div className="asset-modal">
        <div className="asset-modal__assets">
          {assets.map(asset =>
            <AssetTile
              key={asset._id}
              onSelect={onSelect}
              asset={asset}
              isActive={value === asset._id}
            />)}
        </div>
      </div>
    );
  }
}
