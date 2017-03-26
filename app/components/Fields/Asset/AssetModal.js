import React, { Component, PropTypes } from 'react';

const AssetTile = ({ asset, isActive, onSelect }) => (
  <button onClick={() => onSelect(asset)} className={isActive ? 'asset__tile is-active' : 'asset__tile'}>
    <img src={`/public/assets/${asset.filename}`} alt={asset.title} />
  </button>
);
AssetTile.propTypes = {
  asset: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default class AssetModal extends Component {
  static propTypes = {
    assets: PropTypes.arrayOf(PropTypes.object),
    value: PropTypes.object,
    onSelect: PropTypes.func.isRequired,
    close: PropTypes.func,
  }

  static defaultProps = {
    assets: [],
    close: null,
    value: null,
  }

  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
  }

  onSelect(value) {
    this.props.onSelect(value);
    this.props.close();
  }

  render() {
    const { assets, value } = this.props;

    return (
      <div className="asset-modal">
        <div className="asset-modal__assets">
          {assets.map(asset =>
            <AssetTile
              key={asset._id}
              onSelect={this.onSelect}
              asset={asset}
              isActive={value && value._id === asset._id}
            />)}
        </div>
      </div>
    );
  }
}
