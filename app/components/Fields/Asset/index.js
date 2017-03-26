import React, { Component, PropTypes } from 'react';
import store from '../../../utils/store';
import Icon from '../../../utils/icons';
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
    this.state = { value: JSON.parse(props.defaultValue) };
  }

  onSelect(value) {
    this.setState({ value });
  }

  toggle() {
    const assets = store.getState().assets.assets;
    const { value } = this.state;
    store.dispatch(openModal(
      <AssetModal
        value={value}
        full
        onSelect={this.onSelect}
        assets={assets}
      />));
  }

  render() {
    const { name, label, instructions } = this.props;
    const { value } = this.state;

    return (
      <div className="asset-wrapper form-element">
        {label && <span className="input__label">{label}</span>}
        {instructions && <p className="input__instructions">{instructions}</p>}

        <button className="asset__btn" title="Pick an asset" type="button" onClick={this.toggle}>
          <div className="asset__btn__img-wrapper">
            {value
              ? <img src={`/public/assets/${value.filename}`} alt={value.title} />
              : <Icon icon="image" width={32} height={32} />
            }
          </div>

          {value && <h5 className="asset__btn__title">{value.title}</h5>}
        </button>
        <input type="text" name={name} value={JSON.stringify(value)} readOnly hidden />
      </div>
    );
  }
}
