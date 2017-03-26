import React, { Component, PropTypes } from 'react';
import Table from '../../Table';
import { truncate, formatDate, formatBytes } from '../../../utils/helpers';

const AssetTile = ({ asset, isActive, onSelect }) => (
  <button onClick={() => onSelect(asset)} className={isActive ? 'asset__tile is-active' : 'asset__tile'}>
    <img src={`/public/assets/${asset.filename}`} alt={asset.title} />
    <span>{truncate(asset.title, 15)}</span>
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
    onSelect: PropTypes.func.isRequired,
    close: PropTypes.func,
  }

  static defaultProps = {
    assets: [],
    close: null,
  }

  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
  }

  onSelect(_id) {
    const { assets } = this.props;
    const value = assets.find(asset => asset._id === _id);
    this.props.onSelect(value);
    this.props.close();
  }

  render() {
    const { assets } = this.props;

    const reduced = assets.map(props => ({
      key: props._id,
      image: {
        sortBy: false,
        component: <button className="asset__thumbnail" type="button" onClick={() => this.onSelect(props)}><img src={`/public/assets/${props.filename}`} alt={props.filename} /></button>,
      },
      title: props.title,
      filename: props.filename,
      size: formatBytes(props.size, 0),
      dateCreated: {
        value: new Date(props.dateCreated).getTime(),
        component: formatDate(props.dateCreated),
      },
    }));

    return (
      <div className="asset-modal">
        <div className="asset-modal__assets">
          {reduced.length > 0 ? <Table onRowClick={this.onSelect} className="asset-modal__table" showSearch={false} data={reduced} /> : <h3>No assets!</h3>}
        </div>
      </div>
    );
  }
}
