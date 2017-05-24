import React, { Component } from 'react';
import PropTypes from 'prop-types';
import store from 'utils/store';
import Icon from 'utils/icons';
import { openModal } from 'actions/uiActions';
import AssetModal from './AssetModal';
import './Asset.scss';

export default class Asset extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    instructions: PropTypes.string,
    defaultValue: PropTypes.object,
    readOnly: PropTypes.bool,
  }

  static defaultProps = {
    instructions: null,
    defaultValue: null,
    readOnly: false,
  }

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.state = { value: props.defaultValue };
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
    const { name, label, instructions, readOnly } = this.props;
    const { value } = this.state;

    const Btn = ({ contents }) => (
      <button className="asset__btn" title="Pick an asset" type="button" onClick={this.toggle}>
        {contents}
      </button>
    );

    const contents = (
      <div className="asset__img-wrapper">
        {value
          ? <img src={`/public/assets/${value.filename}`} alt={value.title} />
          : <Icon icon="image" width={32} height={32} />
        }
      </div>
    );

    return (
      <div className="asset-wrapper form-element">
        {label && <span className="input__label">{label}</span>}
        {instructions && <p className="input__instructions">{instructions}</p>}

        {readOnly ? contents : <Btn contents={contents} />}
        {value && <h5 className="asset__btn__title">{label === value.title ? value.filename : value.title}</h5>}
        {value && Object.keys(value).map(key => <input key={key} type="text" name={`${name}[${key}]`} value={value[key]} readOnly hidden />)}
      </div>
    );
  }
}
