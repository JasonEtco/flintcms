import React, { Component, PropTypes } from 'react';
import store from '../../../utils/store';
import { openModal } from '../../../actions/uiActions';
import AssetModal from './AssetModal';
import './Asset.scss';

export default class Asset extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    instructions: PropTypes.string,
    defaultValue: PropTypes.string,
  }

  static defaultProps = {
    instructions: null,
    defaultValue: null,
  }

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  state = { value: null }

  onSelect(value) {
    this.setState({ value });
  }

  toggle() {
    const assets = store.getState().assets.assets;
    store.dispatch(openModal(<AssetModal full onSelect={this.onSelect} assets={assets} />));
  }

  render() {
    return (
      <div className="asset-wrapper form-element">
        <button className="asset__btn" title="Pick an asset" type="button" onClick={this.toggle}>
          {this.state.value}
        </button>
      </div>
    );
  }
}
