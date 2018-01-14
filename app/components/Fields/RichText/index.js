/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import RichTextEditor from 'react-rte';
import { formatStringWithCode } from 'utils/helpers';
import './RichText.scss';

export default class RichText extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    instructions: PropTypes.string,
    defaultValue: PropTypes.string,
    required: PropTypes.bool,
  }

  static defaultProps = {
    instructions: null,
    defaultValue: null,
    contentState: null,
    required: false,
    onChange: ()=>{}
  }

  static validate(val) {
    return val !== '' && val !== '<p><br></p>';
  }

  constructor(props) {
    super(props);
    if (props.defaultValue) {
      const value = RichTextEditor.createValueFromString(props.defaultValue, 'html');
      this.state = { value };
    } else {
      const value = RichTextEditor.createEmptyValue();
      this.state = { value };
    }

    this.focus = () => this[props.name].focus();
    this.onChange = value => {
      this.setState({ value });
      this.props.onChange(value.toString('html'));
    }
  }

  render() {
    const { value } = this.state;
    const { name, label, instructions, required } = this.props;

    const classes = classnames(
      'rich-text-wrapper',
      'form-element',
      { 'form-element--required': required },
    );

    return (
      <div className={classes}>
        {label && <label className="input__label" htmlFor={name}>{label}</label>}
        {instructions
          && <p className="input__instructions" dangerouslySetInnerHTML={{ __html: formatStringWithCode(instructions) }} /> // eslint-disable-line react/no-danger
        }
        <RichTextEditor
          value={value}
          onChange={this.onChange}
          toolbarClassName="rich-text-toolbar"
          editorClassName="rich-text-editor"
        />
        <input type="text" readOnly required={required} hidden name={name} value={value.toString('html')} />
      </div>
    );
  }
}
